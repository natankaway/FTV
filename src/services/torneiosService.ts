import api from './api';
import type { Torneio } from '@/types';

export interface CreateTorneioData {
  nome: string;
  descricao?: string;
  data_inicio: string;
  data_fim?: string;
  local?: string;
  unidade_id?: string;
  categoria?: string;
  max_participantes?: number;
  valor_inscricao?: number;
  status?: 'planejado' | 'inscricoes_abertas' | 'em_andamento' | 'finalizado' | 'cancelado';
}

export interface UpdateTorneioData extends Partial<CreateTorneioData> {}

export interface TorneioFilters {
  unidade_id?: string;
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
