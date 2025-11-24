import api from './api';
import type { Exercicio } from '@/types';

export interface CreateExercicioData {
  nome: string;
  duracao?: number;
  descricao?: string;
  categoria?: 'aquecimento' | 'tecnica' | 'tatica' | 'fisico' | 'finalizacao';
  equipamentos?: string[];
  nivel?: 'iniciante' | 'intermediario' | 'avancado';
}

export interface UpdateExercicioData extends Partial<CreateExercicioData> {}

export interface ExercicioFilters {
  categoria?: string;
  nivel?: string;
}

class ExerciciosService {
  async getAll(filters?: ExercicioFilters): Promise<Exercicio[]> {
    const { data } = await api.get('/exercicios', { params: filters });
    return data.exercicios;
  }

  async getById(id: number): Promise<Exercicio> {
    const { data } = await api.get(`/exercicios/${id}`);
    return data.exercicio;
  }

  async create(exercicioData: CreateExercicioData): Promise<Exercicio> {
    const { data } = await api.post('/exercicios', exercicioData);
    return data.exercicio;
  }

  async update(id: number, exercicioData: UpdateExercicioData): Promise<Exercicio> {
    const { data } = await api.put(`/exercicios/${id}`, exercicioData);
    return data.exercicio;
  }

  async delete(id: number): Promise<void> {
    await api.delete(`/exercicios/${id}`);
  }
}

export const exerciciosService = new ExerciciosService();
export default exerciciosService;
