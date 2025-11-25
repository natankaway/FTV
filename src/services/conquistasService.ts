import api from './api';
import type { Conquista } from '@/types';

export const conquistasService = {
  async getAll(params?: {
    aluno_id?: number;
    desbloqueada?: boolean;
    tipo?: string;
    dificuldade?: string;
  }): Promise<Conquista[]> {
    const { data } = await api.get('/conquistas', { params });
    return data.conquistas;
  },

  async getById(id: number): Promise<Conquista> {
    const { data } = await api.get(`/conquistas/${id}`);
    return data.conquista;
  },

  async getByAluno(alunoId: number): Promise<any> {
    const { data } = await api.get(`/conquistas/aluno/${alunoId}`);
    return data;
  },

  async create(conquistaData: Partial<Conquista>): Promise<Conquista> {
    const { data } = await api.post('/conquistas', conquistaData);
    return data.conquista;
  },

  async desbloquear(id: number): Promise<Conquista> {
    const { data } = await api.put(`/conquistas/${id}/desbloquear`);
    return data.conquista;
  },

  async update(id: number, conquistaData: Partial<Conquista>): Promise<Conquista> {
    const { data } = await api.put(`/conquistas/${id}`, conquistaData);
    return data.conquista;
  },

  async delete(id: number): Promise<void> {
    await api.delete(`/conquistas/${id}`);
  }
};

export default conquistasService;
