import api from './api';
import type { Treino } from '@/types';

export interface CreateTreinoData {
  nome: string;
  descricao?: string;
  duracao_minutos?: number;
  nivel?: 'iniciante' | 'intermediario' | 'avancado';
  tipo?: string;
  exercicios?: number[];
}

export interface UpdateTreinoData extends Partial<CreateTreinoData> {
  ativo?: boolean;
}

export interface TreinoFilters {
  nivel?: string;
  tipo?: string;
  ativo?: boolean;
}

class TreinosService {
  async getAll(filters?: TreinoFilters): Promise<Treino[]> {
    const { data } = await api.get('/treinos', { params: filters });
    return data.treinos;
  }

  async getById(id: number): Promise<Treino> {
    const { data } = await api.get(`/treinos/${id}`);
    return data.treino;
  }

  async create(treinoData: CreateTreinoData): Promise<Treino> {
    const { data } = await api.post('/treinos', treinoData);
    return data.treino;
  }

  async update(id: number, treinoData: UpdateTreinoData): Promise<Treino> {
    const { data } = await api.put(`/treinos/${id}`, treinoData);
    return data.treino;
  }

  async delete(id: number): Promise<void> {
    await api.delete(`/treinos/${id}`);
  }
}

export const treinosService = new TreinosService();
export default treinosService;
