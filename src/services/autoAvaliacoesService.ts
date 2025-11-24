import api from './api';
import type { AutoAvaliacao } from '@/types';

export const autoAvaliacoesService = {
  async getAll(params?: {
    aluno_id?: number;
    data_inicio?: string;
    data_fim?: string;
    min_nota?: number;
  }): Promise<AutoAvaliacao[]> {
    const { data } = await api.get('/auto-avaliacoes', { params });
    return data.avaliacoes;
  },

  async getById(id: number): Promise<AutoAvaliacao> {
    const { data } = await api.get(`/auto-avaliacoes/${id}`);
    return data.avaliacao;
  },

  async getByAluno(alunoId: number, limit?: number): Promise<any> {
    const { data } = await api.get(`/auto-avaliacoes/aluno/${alunoId}`, {
      params: { limit }
    });
    return data;
  },

  async getEvolucao(alunoId: number, meses: number = 6): Promise<any> {
    const { data } = await api.get(`/auto-avaliacoes/aluno/${alunoId}/evolucao`, {
      params: { meses }
    });
    return data;
  },

  async create(avaliacaoData: Partial<AutoAvaliacao>): Promise<AutoAvaliacao> {
    const { data } = await api.post('/auto-avaliacoes', avaliacaoData);
    return data.avaliacao;
  },

  async update(id: number, avaliacaoData: Partial<AutoAvaliacao>): Promise<AutoAvaliacao> {
    const { data } = await api.put(`/auto-avaliacoes/${id}`, avaliacaoData);
    return data.avaliacao;
  },

  async delete(id: number): Promise<void> {
    await api.delete(`/auto-avaliacoes/${id}`);
  }
};

export default autoAvaliacoesService;
