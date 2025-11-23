import api from './api';
import type { Agendamento } from '@/types';

export interface CreateAgendamentoData {
  aluno_id: number;
  professor_id?: number;
  unidade_id: string;
  data: string;
  horario: string;
  tipo: 'treino' | 'aula' | 'experimental' | 'avaliacao';
  status?: 'agendado' | 'confirmado' | 'cancelado' | 'realizado';
  observacoes?: string;
}

export interface UpdateAgendamentoData extends Partial<CreateAgendamentoData> {}

export interface AgendamentoFilters {
  unidade_id?: string;
  aluno_id?: number;
  professor_id?: number;
  data_inicio?: string;
  data_fim?: string;
  status?: string;
}

class AgendamentosService {
  async getAll(filters?: AgendamentoFilters): Promise<Agendamento[]> {
    const { data } = await api.get('/agendamentos', { params: filters });
    return data.agendamentos;
  }

  async getById(id: number): Promise<Agendamento> {
    const { data } = await api.get(`/agendamentos/${id}`);
    return data.agendamento;
  }

  async create(agendamentoData: CreateAgendamentoData): Promise<Agendamento> {
    const { data } = await api.post('/agendamentos', agendamentoData);
    return data.agendamento;
  }

  async update(id: number, agendamentoData: UpdateAgendamentoData): Promise<Agendamento> {
    const { data } = await api.put(`/agendamentos/${id}`, agendamentoData);
    return data.agendamento;
  }

  async delete(id: number): Promise<void> {
    await api.delete(`/agendamentos/${id}`);
  }
}

export const agendamentosService = new AgendamentosService();
export default agendamentosService;
