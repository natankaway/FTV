import api from './api';
import type { Professor } from '@/types';

export interface CreateProfessorData {
  nome: string;
  email: string;
  telefone?: string;
  senha?: string;
  especialidade?: string;
  unidade_id?: string;
}

export interface UpdateProfessorData extends Partial<CreateProfessorData> {
  ativo?: boolean;
}

class ProfessoresService {
  async getAll(): Promise<Professor[]> {
    const { data } = await api.get('/professores');
    return data.professores;
  }

  async getById(id: number): Promise<Professor> {
    const { data } = await api.get(`/professores/${id}`);
    return data.professor;
  }

  async create(professorData: CreateProfessorData): Promise<Professor> {
    const { data } = await api.post('/professores', professorData);
    return data.professor;
  }

  async update(id: number, professorData: UpdateProfessorData): Promise<Professor> {
    const { data } = await api.put(`/professores/${id}`, professorData);
    return data.professor;
  }

  async delete(id: number): Promise<void> {
    await api.delete(`/professores/${id}`);
  }
}

export const professoresService = new ProfessoresService();
export default professoresService;
