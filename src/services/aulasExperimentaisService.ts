import api from './api';
import type { AulaExperimental } from '@/types';

export interface CreateAulaExperimentalData {
  aluno_id?: string;
  email?: string;
  telefone?: string;
  data_agendamento: string;
  professor_id?: string;
  unidade_id?: string;
  observacoes?: string;
  status?: 'agendada' | 'realizada' | 'nao-compareceu' | 'convertido' | 'inativo';
  data_realizacao?: string;
  data_conversao?: string;
  plano_convertido?: any;
}

export interface UpdateAulaExperimentalData extends Partial<CreateAulaExperimentalData> {}

export interface AulaExperimentalFilters {
  unidade_id?: string;
  status?: string;
  data_inicio?: string;
  data_fim?: string;
}

class AulasExperimentaisService {
  async getAll(filters?: AulaExperimentalFilters): Promise<AulaExperimental[]> {
    const { data } = await api.get('/aulas-experimentais', { params: filters });
    return data.aulasExperimentais;
  }

  async getById(id: number): Promise<AulaExperimental> {
    const { data } = await api.get(`/aulas-experimentais/${id}`);
    return data.aulaExperimental;
  }

  async create(aulaData: CreateAulaExperimentalData): Promise<AulaExperimental> {
    const { data } = await api.post('/aulas-experimentais', aulaData);
    return data.aulaExperimental;
  }

  async update(id: number, aulaData: UpdateAulaExperimentalData): Promise<AulaExperimental> {
    const { data } = await api.put(`/aulas-experimentais/${id}`, aulaData);
    return data.aulaExperimental;
  }

  async delete(id: number): Promise<void> {
    await api.delete(`/aulas-experimentais/${id}`);
  }
}

export const aulasExperimentaisService = new AulasExperimentaisService();
export default aulasExperimentaisService;
