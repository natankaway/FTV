import api from './api';
import type { Unidade } from '@/types';

export interface CreateUnidadeData {
  nome: string;
  endereco?: string;
  telefone?: string;
  email?: string;
}

export interface UpdateUnidadeData extends Partial<CreateUnidadeData> {
  ativa?: boolean;
}

class UnidadesService {
  async getAll(): Promise<Unidade[]> {
    const { data } = await api.get('/unidades');
    return data.unidades;
  }

  async getById(id: string): Promise<Unidade> {
    const { data } = await api.get(`/unidades/${id}`);
    return data.unidade;
  }

  async create(unidadeData: CreateUnidadeData): Promise<Unidade> {
    const { data } = await api.post('/unidades', unidadeData);
    return data.unidade;
  }

  async update(id: string, unidadeData: UpdateUnidadeData): Promise<Unidade> {
    const { data } = await api.put(`/unidades/${id}`, unidadeData);
    return data.unidade;
  }

  async delete(id: string): Promise<void> {
    await api.delete(`/unidades/${id}`);
  }
}

export const unidadesService = new UnidadesService();
export default unidadesService;
