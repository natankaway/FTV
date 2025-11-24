import api from './api';
import type { Agendamento } from '@/types';

export interface CreateAgendamentoData {
  aluno_id?: string;
  professor_id: string;
  unidade_id?: string;
  data: string;
  hora_inicio: string;
  hora_fim: string;
  tipo?: 'aula' | 'treino' | 'avaliacao' | 'individual';
  status?: 'confirmado' | 'pendente' | 'cancelado';
  observacoes?: string;
  recorrencia_tipo?: 'nenhuma' | 'semanal' | 'quinzenal' | 'mensal';
  recorrencia_quantidade?: number;
}

export interface UpdateAgendamentoData extends Partial<CreateAgendamentoData> {}

export interface AgendamentoFilters {
  unidade_id?: string;
  aluno_id?: string;
  professor_id?: string;
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
