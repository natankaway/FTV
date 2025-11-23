import api from './api';
import type { Horario } from '@/types';

export interface CreateHorarioData {
  unidade_id: string;
  professor_id?: number;
  dia_semana: number; // 0-6 (domingo-sábado)
  hora_inicio: string;
  hora_fim: string;
  tipo?: string;
  capacidade?: number;
  ativo?: boolean;
}

export interface UpdateHorarioData extends Partial<CreateHorarioData> {}

export interface HorarioFilters {
  unidade_id?: string;
  professor_id?: number;
  dia_semana?: number;
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
