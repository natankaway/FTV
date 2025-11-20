import api from './api';
import type { Produto } from '@/types';

export interface CreateProdutoData {
  nome: string;
  descricao?: string;
  preco: number;
  categoria: string;
  estoque?: number;
}

export interface UpdateProdutoData extends Partial<CreateProdutoData> {
  ativo?: boolean;
}

class ProdutosService {
  async getAll(): Promise<Produto[]> {
    const { data } = await api.get('/produtos');
    return data.produtos;
  }

  async getById(id: number): Promise<Produto> {
    const { data } = await api.get(`/produtos/${id}`);
    return data.produto;
  }

  async create(produtoData: CreateProdutoData): Promise<Produto> {
    const { data } = await api.post('/produtos', produtoData);
    return data.produto;
  }

  async update(id: number, produtoData: UpdateProdutoData): Promise<Produto> {
    const { data } = await api.put(`/produtos/${id}`, produtoData);
    return data.produto;
  }

  async delete(id: number): Promise<void> {
    await api.delete(`/produtos/${id}`);
  }
}

export const produtosService = new ProdutosService();
export default produtosService;
