import api from './api';
import type { Exercicio } from '@/types';

export interface CreateExercicioData {
  nome: string;
  descricao?: string;
  tipo?: string;
  grupo_muscular?: string;
  nivel?: 'iniciante' | 'intermediario' | 'avancado';
  video_url?: string;
  imagem_url?: string;
}

export interface UpdateExercicioData extends Partial<CreateExercicioData> {
  ativo?: boolean;
}

export interface ExercicioFilters {
  tipo?: string;
  nivel?: string;
  grupo_muscular?: string;
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
