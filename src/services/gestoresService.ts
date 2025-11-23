import api from './api';
import type { Gestor } from '@/types';

export interface CreateGestorData {
  usuario_id?: number;
  nome: string;
  email: string;
  telefone?: string;
  cargo?: string;
  unidades_ids?: string[];
  permissoes?: string[];
}

export interface UpdateGestorData extends Partial<CreateGestorData> {
  ativo?: boolean;
}

export interface GestorFilters {
  unidade_id?: string;
  ativo?: boolean;
}

class GestoresService {
  async getAll(filters?: GestorFilters): Promise<Gestor[]> {
    const { data } = await api.get('/gestores', { params: filters });
    return data.gestores;
  }

  async getById(id: number): Promise<Gestor> {
    const { data } = await api.get(`/gestores/${id}`);
    return data.gestor;
  }

  async create(gestorData: CreateGestorData): Promise<Gestor> {
    const { data } = await api.post('/gestores', gestorData);
    return data.gestor;
  }

  async update(id: number, gestorData: UpdateGestorData): Promise<Gestor> {
    const { data } = await api.put(`/gestores/${id}`, gestorData);
    return data.gestor;
  }

  async delete(id: number): Promise<void> {
    await api.delete(`/gestores/${id}`);
  }
}

export const gestoresService = new GestoresService();
export default gestoresService;
