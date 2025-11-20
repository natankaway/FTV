import api from './api';
import type { RegistroFinanceiro } from '@/types';

export interface CreateTransacaoData {
  aluno_id?: number;
  tipo: 'entrada' | 'saida';
  categoria: string;
  descricao: string;
  valor: number;
  data: string;
  metodo_pagamento?: string;
  unidade_id?: string;
  status?: 'pendente' | 'pago' | 'cancelado';
}

export interface UpdateTransacaoData extends Partial<CreateTransacaoData> {}

export interface FinanceiroFilters {
  tipo?: 'entrada' | 'saida';
  data_inicio?: string;
  data_fim?: string;
  unidade_id?: string;
  aluno_id?: number;
  status?: string;
}

class FinanceiroService {
  async getAll(filters?: FinanceiroFilters): Promise<RegistroFinanceiro[]> {
    const { data } = await api.get('/financeiro', { params: filters });
    return data.transacoes;
  }

  async getById(id: number): Promise<RegistroFinanceiro> {
    const { data } = await api.get(`/financeiro/${id}`);
    return data.transacao;
  }

  async create(transacaoData: CreateTransacaoData): Promise<RegistroFinanceiro> {
    const { data } = await api.post('/financeiro', transacaoData);
    return data.transacao;
  }

  async update(id: number, transacaoData: UpdateTransacaoData): Promise<RegistroFinanceiro> {
    const { data } = await api.put(`/financeiro/${id}`, transacaoData);
    return data.transacao;
  }

  async delete(id: number): Promise<void> {
    await api.delete(`/financeiro/${id}`);
  }

  async getResumo(dataInicio?: string, dataFim?: string): Promise<any> {
    const { data } = await api.get('/financeiro/resumo', {
      params: { data_inicio: dataInicio, data_fim: dataFim }
    });
    return data.resumo;
  }
}

export const financeiroService = new FinanceiroService();
export default financeiroService;
