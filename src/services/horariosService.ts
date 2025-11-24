import api from './api';
import type { Horario } from '@/types';

export interface CreateHorarioData {
  unidade_id?: string;
  dia_semana: 'segunda' | 'terca' | 'quarta' | 'quinta' | 'sexta' | 'sabado' | 'domingo';
  hora_inicio: string;
  hora_fim: string;
  capacidade?: number;
  nivel_id?: string;
  ativo?: boolean;
}

export interface UpdateHorarioData extends Partial<CreateHorarioData> {}

export interface HorarioFilters {
  unidade_id?: string;
  dia_semana?: string;
  ativo?: boolean;
}

class HorariosService {
  async getAll(filters?: HorarioFilters): Promise<Horario[]> {
    const { data } = await api.get('/horarios', { params: filters });
    return data.horarios;
  }

  async getById(id: number): Promise<Horario> {
    const { data } = await api.get(`/horarios/${id}`);
    return data.horario;
  }

  async create(horarioData: CreateHorarioData): Promise<Horario> {
    const { data } = await api.post('/horarios', horarioData);
    return data.horario;
  }

  async update(id: number, horarioData: UpdateHorarioData): Promise<Horario> {
    const { data } = await api.put(`/horarios/${id}`, horarioData);
    return data.horario;
  }

  async delete(id: number): Promise<void> {
    await api.delete(`/horarios/${id}`);
  }
}

export const horariosService = new HorariosService();
export default horariosService;
