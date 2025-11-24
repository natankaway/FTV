import api from './api';
import type { ObjetivoPessoal } from '@/types';

export const objetivosPessoaisService = {
  async getAll(params?: {
    aluno_id?: number;
    status?: string;
    tipo?: string;
  }): Promise<ObjetivoPessoal[]> {
    const { data } = await api.get('/objetivos-pessoais', { params });
    return data.objetivos;
  },

  async getById(id: number): Promise<ObjetivoPessoal> {
    const { data } = await api.get(`/objetivos-pessoais/${id}`);
    return data.objetivo;
  },

  async getByAluno(alunoId: number, status?: string): Promise<any> {
    const { data } = await api.get(`/objetivos-pessoais/aluno/${alunoId}`, {
      params: { status }
    });
    return data;
  },

  async create(objetivoData: Partial<ObjetivoPessoal>): Promise<ObjetivoPessoal> {
    const { data } = await api.post('/objetivos-pessoais', objetivoData);
    return data.objetivo;
  },

  async update(id: number, objetivoData: Partial<ObjetivoPessoal>): Promise<ObjetivoPessoal> {
    const { data } = await api.put(`/objetivos-pessoais/${id}`, objetivoData);
    return data.objetivo;
  },

  async atualizarProgresso(id: number, progresso?: number, incremento?: number): Promise<ObjetivoPessoal> {
    const { data } = await api.put(`/objetivos-pessoais/${id}/progresso`, {
      progresso,
      incremento
    });
    return data.objetivo;
  },

  async cancelar(id: number): Promise<ObjetivoPessoal> {
    const { data } = await api.put(`/objetivos-pessoais/${id}/cancelar`);
    return data.objetivo;
  },

  async delete(id: number): Promise<void> {
    await api.delete(`/objetivos-pessoais/${id}`);
  }
};

export default objetivosPessoaisService;
