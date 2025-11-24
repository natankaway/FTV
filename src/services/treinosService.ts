import api from './api';
import type { Treino } from '@/types';

export interface CreateTreinoData {
  nome: string;
  tipo?: 'tecnico' | 'fisico' | 'tatico' | 'jogo';
  nivel?: 'iniciante' | 'intermediario' | 'avancado';
  duracao?: number;
  objetivo?: string;
  equipamentos?: string[];
  observacoes?: string;
  professor_id?: string;
  unidade_id?: string;
  data?: string;
  status?: 'planejado' | 'em-andamento' | 'concluido';
  prancheta_data?: any;
}

export interface UpdateTreinoData extends Partial<CreateTreinoData> {}

export interface TreinoFilters {
  nivel?: string;
  tipo?: string;
  status?: string;
  professor_id?: string;
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
