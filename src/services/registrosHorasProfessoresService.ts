import api from './api';
import type { RegistroHorasProfessor } from '@/types';

export const registrosHorasProfessoresService = {
  async getAll(params?: {
    professor_id?: number;
    unidade_id?: string;
    data_inicio?: string;
    data_fim?: string;
    tipo_atividade?: string;
  }): Promise<RegistroHorasProfessor[]> {
    const { data } = await api.get('/registros-horas-professores', { params });
    return data.registros;
  },

  async getById(id: number): Promise<RegistroHorasProfessor> {
    const { data } = await api.get(`/registros-horas-professores/${id}`);
    return data.registro;
  },

  async create(registroData: Partial<RegistroHorasProfessor>): Promise<RegistroHorasProfessor> {
    const { data } = await api.post('/registros-horas-professores', registroData);
    return data.registro;
  },

  async update(id: number, registroData: Partial<RegistroHorasProfessor>): Promise<RegistroHorasProfessor> {
    const { data } = await api.put(`/registros-horas-professores/${id}`, registroData);
    return data.registro;
  },

  async delete(id: number): Promise<void> {
    await api.delete(`/registros-horas-professores/${id}`);
  },

  async getRelatorio(params?: {
    professor_id?: number;
    unidade_id?: string;
    mes?: number;
    ano?: number;
  }): Promise<any> {
    const { data } = await api.get('/registros-horas-professores/relatorio', { params });
    return data;
  }
};

export default registrosHorasProfessoresService;
