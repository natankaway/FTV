import api from './api';
import type { ListaPresenca, PreCheckin, PresencaConfirmada } from '@/types';

export const listasPresencaService = {
  async getAll(params?: {
    unidade_id?: string;
    status?: string;
    tipo?: string;
    data_inicio?: string;
    data_fim?: string;
  }): Promise<ListaPresenca[]> {
    const { data } = await api.get('/listas-presenca', { params });
    return data.listas;
  },

  async getById(id: string): Promise<ListaPresenca> {
    const { data } = await api.get(`/listas-presenca/${id}`);
    return data.lista;
  },

  async create(listaData: Partial<ListaPresenca>): Promise<ListaPresenca> {
    const { data } = await api.post('/listas-presenca', listaData);
    return data.lista;
  },

  async update(id: string, listaData: Partial<ListaPresenca>): Promise<ListaPresenca> {
    const { data } = await api.put(`/listas-presenca/${id}`, listaData);
    return data.lista;
  },

  async delete(id: string): Promise<void> {
    await api.delete(`/listas-presenca/${id}`);
  },

  async fazerPreCheckin(listaId: string, alunoId: number): Promise<PreCheckin> {
    const { data } = await api.post(`/listas-presenca/${listaId}/pre-checkin`, {
      aluno_id: alunoId
    });
    return data.preCheckin;
  },

  async cancelarPreCheckin(listaId: string, checkinId: string, motivo?: string): Promise<PreCheckin> {
    const { data } = await api.delete(`/listas-presenca/${listaId}/pre-checkin/${checkinId}`, {
      data: { motivo_cancelamento: motivo }
    });
    return data.preCheckin;
  },

  async confirmarPresenca(listaId: string, presencaData: Partial<PresencaConfirmada>): Promise<PresencaConfirmada> {
    const { data } = await api.post(`/listas-presenca/${listaId}/confirmar-presenca`, presencaData);
    return data.presenca;
  }
};

export default listasPresencaService;
