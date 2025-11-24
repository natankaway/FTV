import api from './api';
import type { Torneio } from '@/types';

export interface CreateTorneioData {
  nome: string;
  descricao?: string;
  local?: string;
  data_inicio?: string;
  data_fim?: string;
  status?: 'Inscrições' | 'Sorteio' | 'Em andamento' | 'Finalizado';
  criado_por?: string;
}

export interface UpdateTorneioData extends Partial<CreateTorneioData> {}

export interface TorneioFilters {
  status?: string;
  data_inicio?: string;
  data_fim?: string;
}

class TorneiosService {
  async getAll(filters?: TorneioFilters): Promise<Torneio[]> {
    const { data } = await api.get('/torneios', { params: filters });
    return data.torneios;
  }

  async getById(id: number): Promise<Torneio> {
    const { data } = await api.get(`/torneios/${id}`);
    return data.torneio;
  }

  async create(torneioData: CreateTorneioData): Promise<Torneio> {
    const { data } = await api.post('/torneios', torneioData);
    return data.torneio;
  }

  async update(id: number, torneioData: UpdateTorneioData): Promise<Torneio> {
    const { data } = await api.put(`/torneios/${id}`, torneioData);
    return data.torneio;
  }

  async delete(id: number): Promise<void> {
    await api.delete(`/torneios/${id}`);
  }
}

export const torneiosService = new TorneiosService();
export default torneiosService;
