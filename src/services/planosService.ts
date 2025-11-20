import api from './api';
import type { Plano } from '@/types';

export interface CreatePlanoData {
  nome: string;
  descricao?: string;
  valor: number;
  duracao_dias: number;
  aulas_semanais?: number;
}

export interface UpdatePlanoData extends Partial<CreatePlanoData> {
  ativo?: boolean;
}

class PlanosService {
  async getAll(): Promise<Plano[]> {
    const { data } = await api.get('/planos');
    return data.planos;
  }

  async getById(id: number): Promise<Plano> {
    const { data } = await api.get(`/planos/${id}`);
    return data.plano;
  }

  async create(planoData: CreatePlanoData): Promise<Plano> {
    const { data } = await api.post('/planos', planoData);
    return data.plano;
  }

  async update(id: number, planoData: UpdatePlanoData): Promise<Plano> {
    const { data } = await api.put(`/planos/${id}`, planoData);
    return data.plano;
  }

  async delete(id: number): Promise<void> {
    await api.delete(`/planos/${id}`);
  }
}

export const planosService = new PlanosService();
export default planosService;
