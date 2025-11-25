import api from './api';
import type { AvaliacaoNivel } from '@/types';

export const avaliacoesNivelService = {
  async getAll(params?: {
    aluno_id?: number;
    resultado?: string;
    data_inicio?: string;
    data_fim?: string;
  }): Promise<AvaliacaoNivel[]> {
    const { data } = await api.get('/avaliacoes-nivel', { params });
    return data.avaliacoes;
  },

  async getById(id: number): Promise<AvaliacaoNivel> {
    const { data } = await api.get(`/avaliacoes-nivel/${id}`);
    return data.avaliacao;
  },

  async getHistoricoAluno(alunoId: number): Promise<AvaliacaoNivel[]> {
    const { data } = await api.get(`/avaliacoes-nivel/aluno/${alunoId}/historico`);
    return data.historico;
  },

  async create(avaliacaoData: Partial<AvaliacaoNivel>): Promise<AvaliacaoNivel> {
    const { data } = await api.post('/avaliacoes-nivel', avaliacaoData);
    return data.avaliacao;
  },

  async update(id: number, avaliacaoData: Partial<AvaliacaoNivel>): Promise<AvaliacaoNivel> {
    const { data } = await api.put(`/avaliacoes-nivel/${id}`, avaliacaoData);
    return data.avaliacao;
  },

  async delete(id: number): Promise<void> {
    await api.delete(`/avaliacoes-nivel/${id}`);
  },

  async getAlunosPendentes(unidade_id?: string): Promise<any[]> {
    const { data } = await api.get('/avaliacoes-nivel/alunos-pendentes', {
      params: { unidade_id }
    });
    return data.alunos;
  }
};

export default avaliacoesNivelService;
