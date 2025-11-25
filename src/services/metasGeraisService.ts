import api from './api';
import type { MetaGeral } from '@/types';

interface MetaGeralCreateData {
  titulo: string;
  descricao?: string;
  escopo: 'CT' | 'Unidade';
  unidade_id?: string;
  valor_alvo: number;
  valor_atual?: number;
  prazo?: string;
  responsavel?: string;
}

interface MetaGeralUpdateData extends Partial<MetaGeralCreateData> {}

interface MetasGeraisParams {
  escopo?: 'CT' | 'Unidade';
  unidade_id?: string;
}

interface EstatisticasMetas {
  total: number;
  emAndamento: number;
  concluidas: number;
  atrasadas: number;
  progressoMedio: number;
}

class MetasGeraisService {
  private basePath = '/metas-gerais';

  async getAll(params?: MetasGeraisParams): Promise<MetaGeral[]> {
    const response = await api.get(this.basePath, { params });
    return response.data.metas.map((meta: any) => ({
      id: meta.id,
      titulo: meta.titulo,
      descricao: meta.descricao,
      escopo: meta.escopo,
      unidadeId: meta.unidade_id,
      valorAlvo: meta.valor_alvo,
      valorAtual: meta.valor_atual,
      prazo: meta.prazo,
      responsavel: meta.responsavel,
      criadoEm: meta.created_at,
      atualizadoEm: meta.updated_at
    }));
  }

  async getById(id: string): Promise<MetaGeral> {
    const response = await api.get(`${this.basePath}/${id}`);
    const meta = response.data.meta;
    return {
      id: meta.id,
      titulo: meta.titulo,
      descricao: meta.descricao,
      escopo: meta.escopo,
      unidadeId: meta.unidade_id,
      valorAlvo: meta.valor_alvo,
      valorAtual: meta.valor_atual,
      prazo: meta.prazo,
      responsavel: meta.responsavel,
      criadoEm: meta.created_at,
      atualizadoEm: meta.updated_at
    };
  }

  async create(data: MetaGeralCreateData): Promise<MetaGeral> {
    const response = await api.post(this.basePath, data);
    const meta = response.data.meta;
    return {
      id: meta.id,
      titulo: meta.titulo,
      descricao: meta.descricao,
      escopo: meta.escopo,
      unidadeId: meta.unidade_id,
      valorAlvo: meta.valor_alvo,
      valorAtual: meta.valor_atual,
      prazo: meta.prazo,
      responsavel: meta.responsavel,
      criadoEm: meta.created_at,
      atualizadoEm: meta.updated_at
    };
  }

  async update(id: string, data: MetaGeralUpdateData): Promise<MetaGeral> {
    const response = await api.put(`${this.basePath}/${id}`, data);
    const meta = response.data.meta;
    return {
      id: meta.id,
      titulo: meta.titulo,
      descricao: meta.descricao,
      escopo: meta.escopo,
      unidadeId: meta.unidade_id,
      valorAlvo: meta.valor_alvo,
      valorAtual: meta.valor_atual,
      prazo: meta.prazo,
      responsavel: meta.responsavel,
      criadoEm: meta.created_at,
      atualizadoEm: meta.updated_at
    };
  }

  async updateProgress(id: string, valorAtual: number): Promise<MetaGeral> {
    const response = await api.patch(`${this.basePath}/${id}/progresso`, {
      valor_atual: valorAtual
    });
    const meta = response.data.meta;
    return {
      id: meta.id,
      titulo: meta.titulo,
      descricao: meta.descricao,
      escopo: meta.escopo,
      unidadeId: meta.unidade_id,
      valorAlvo: meta.valor_alvo,
      valorAtual: meta.valor_atual,
      prazo: meta.prazo,
      responsavel: meta.responsavel,
      criadoEm: meta.created_at,
      atualizadoEm: meta.updated_at
    };
  }

  async delete(id: string): Promise<void> {
    await api.delete(`${this.basePath}/${id}`);
  }

  async getEstatisticas(params?: MetasGeraisParams): Promise<EstatisticasMetas> {
    const response = await api.get(`${this.basePath}/estatisticas`, { params });
    return response.data;
  }
}

export const metasGeraisService = new MetasGeraisService();
