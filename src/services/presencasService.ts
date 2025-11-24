import api from './api';
import type { Presenca } from '@/types';

export interface CreatePresencaData {
  aluno_id: string;
  data: string;
  hora: string;
  status?: 'presente' | 'falta';
  tipo?: 'treino' | 'aula' | 'individual';
  professor_id?: string;
  unidade_id?: string;
}

export interface UpdatePresencaData extends Partial<CreatePresencaData> {}

class PresencasService {
  async getAll(params?: { aluno_id?: number; data_inicio?: string; data_fim?: string }): Promise<Presenca[]> {
    const { data } = await api.get('/presencas', { params });
    return data.presencas;
  }

  async getById(id: number): Promise<Presenca> {
    const { data } = await api.get(`/presencas/${id}`);
    return data.presenca;
  }

  async create(presencaData: CreatePresencaData): Promise<Presenca> {
    const { data } = await api.post('/presencas', presencaData);
    return data.presenca;
  }

  async update(id: number, presencaData: UpdatePresencaData): Promise<Presenca> {
    const { data } = await api.put(`/presencas/${id}`, presencaData);
    return data.presenca;
  }

  async delete(id: number): Promise<void> {
    await api.delete(`/presencas/${id}`);
  }

  async getByAluno(alunoId: number, dataInicio?: string, dataFim?: string): Promise<Presenca[]> {
    const { data } = await api.get(`/presencas/aluno/${alunoId}`, {
      params: { data_inicio: dataInicio, data_fim: dataFim }
    });
    return data.presencas;
  }
}

export const presencasService = new PresencasService();
export default presencasService;
