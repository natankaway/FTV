import { supabaseAdmin } from '../config/supabase.js';

// GET /api/financeiro - Listar transações financeiras (com filtros)
export const listarTransacoes = async (req, res) => {
  try {
    const { tipo, data_inicio, data_fim, unidade_id, aluno_id, status } = req.query;

    let query = supabaseAdmin
      .from('registros_financeiros')
      .select('*')
      .order('data', { ascending: false });

    if (tipo) {
      query = query.eq('tipo', tipo);
    }

    if (data_inicio) {
      query = query.gte('data', data_inicio);
    }

    if (data_fim) {
      query = query.lte('data', data_fim);
    }

    if (unidade_id) {
      query = query.eq('unidade_id', unidade_id);
    }

    if (aluno_id) {
      query = query.eq('aluno_id', aluno_id);
    }

    if (status) {
      query = query.eq('status', status);
    }

    const { data: transacoes, error } = await query;

    if (error) throw error;

    res.json({ transacoes });
  } catch (error) {
    console.error('Erro ao listar transações:', error);
    res.status(500).json({ error: 'Erro ao listar transações' });
  }
};

// GET /api/financeiro/:id - Buscar transação por ID
export const buscarTransacao = async (req, res) => {
  try {
    const { id } = req.params;

    const { data: transacao, error } = await supabaseAdmin
      .from('registros_financeiros')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;

    if (!transacao) {
      return res.status(404).json({ error: 'Transação não encontrada' });
    }

    res.json({ transacao });
  } catch (error) {
    console.error('Erro ao buscar transação:', error);
    res.status(500).json({ error: 'Erro ao buscar transação' });
  }
};

// GET /api/financeiro/resumo - Obter resumo financeiro
export const obterResumo = async (req, res) => {
  try {
    const { data_inicio, data_fim } = req.query;

    let query = supabaseAdmin
      .from('registros_financeiros')
      .select('tipo, valor, status');

    if (data_inicio) {
      query = query.gte('data', data_inicio);
    }

    if (data_fim) {
      query = query.lte('data', data_fim);
    }

    const { data: transacoes, error } = await query;

    if (error) throw error;

    const resumo = transacoes.reduce((acc, t) => {
      if (t.status === 'pago') {
        if (t.tipo === 'receita') {
          acc.receitas += t.valor;
        } else if (t.tipo === 'despesa') {
          acc.despesas += t.valor;
        }
      }
      return acc;
    }, { receitas: 0, despesas: 0 });

    resumo.saldo = resumo.receitas - resumo.despesas;

    res.json({ resumo });
  } catch (error) {
    console.error('Erro ao obter resumo financeiro:', error);
    res.status(500).json({ error: 'Erro ao obter resumo financeiro' });
  }
};

// POST /api/financeiro - Criar nova transação
export const criarTransacao = async (req, res) => {
  try {
    const transacaoData = req.body;

    const { data: transacao, error } = await supabaseAdmin
      .from('registros_financeiros')
      .insert([transacaoData])
      .select()
      .single();

    if (error) throw error;

    res.status(201).json({ transacao });
  } catch (error) {
    console.error('Erro ao criar transação:', error);
    res.status(500).json({ error: 'Erro ao criar transação' });
  }
};

// PUT /api/financeiro/:id - Atualizar transação
export const atualizarTransacao = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const { data: transacao, error } = await supabaseAdmin
      .from('registros_financeiros')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    res.json({ transacao });
  } catch (error) {
    console.error('Erro ao atualizar transação:', error);
    res.status(500).json({ error: 'Erro ao atualizar transação' });
  }
};

// DELETE /api/financeiro/:id - Deletar transação
export const deletarTransacao = async (req, res) => {
  try {
    const { id } = req.params;

    const { error } = await supabaseAdmin
      .from('registros_financeiros')
      .delete()
      .eq('id', id);

    if (error) throw error;

    res.json({ message: 'Transação deletada com sucesso' });
  } catch (error) {
    console.error('Erro ao deletar transação:', error);
    res.status(500).json({ error: 'Erro ao deletar transação' });
  }
};
