import api from './api';
import type { Aluno } from '@/types';

export interface CreateAlunoData {
  nome: string;
  email: string;
  telefone?: string;
  senha?: string;
  tipo_plano: 'mensalidade' | 'plataforma' | 'experimental';
  plano_id?: number;
  plataforma_parceira?: string;
  unidade_id: string;
  vencimento?: string;
  nivel?: 'iniciante' | 'intermediario' | 'avancado';
  objetivo?: string;
}

export interface UpdateAlunoData extends Partial<CreateAlunoData> {
  status?: 'ativo' | 'pendente' | 'inativo';
  ativo?: boolean;
}

export interface AlunoFilters {
  unidade_id?: string;
  status?: string;
  nivel?: string;
}

class AlunosService {
  async getAll(filters?: AlunoFilters): Promise<Aluno[]> {
    const { data } = await api.get('/alunos', { params: filters });
    return data.alunos;
  }

  async getById(id: number): Promise<Aluno> {
    const { data } = await api.get(`/alunos/${id}`);
    return data.aluno;
  }

  async create(alunoData: CreateAlunoData): Promise<Aluno> {
    const { data } = await api.post('/alunos', alunoData);
    return data.aluno;
  }

  async update(id: number, alunoData: UpdateAlunoData): Promise<Aluno> {
    const { data } = await api.put(`/alunos/${id}`, alunoData);
    return data.aluno;
  }

  async delete(id: number): Promise<void> {
    await api.delete(`/alunos/${id}`);
  }

  async getStats(id: number): Promise<any> {
    const { data } = await api.get(`/alunos/${id}/stats`);
    return data.stats;
  }
}

export const alunosService = new AlunosService();
export default alunosService;
