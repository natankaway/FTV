import { supabaseAdmin } from '../config/supabase.js';

// GET /api/presencas - Listar todas as presenças (com filtros opcionais)
export const listarPresencas = async (req, res) => {
  try {
    const { aluno_id, data_inicio, data_fim } = req.query;

    let query = supabaseAdmin
      .from('presencas')
      .select('*')
      .order('data', { ascending: false });

    if (aluno_id) {
      query = query.eq('aluno_id', aluno_id);
    }

    if (data_inicio) {
      query = query.gte('data', data_inicio);
    }

    if (data_fim) {
      query = query.lte('data', data_fim);
    }

    const { data: presencas, error } = await query;

    if (error) throw error;

    res.json({ presencas });
  } catch (error) {
    console.error('Erro ao listar presenças:', error);
    res.status(500).json({ error: 'Erro ao listar presenças' });
  }
};

// GET /api/presencas/:id - Buscar presença por ID
export const buscarPresenca = async (req, res) => {
  try {
    const { id } = req.params;

    const { data: presenca, error } = await supabaseAdmin
      .from('presencas')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;

    if (!presenca) {
      return res.status(404).json({ error: 'Presença não encontrada' });
    }

    res.json({ presenca });
  } catch (error) {
    console.error('Erro ao buscar presença:', error);
    res.status(500).json({ error: 'Erro ao buscar presença' });
  }
};

// GET /api/presencas/aluno/:alunoId - Buscar presenças de um aluno específico
export const buscarPresencasPorAluno = async (req, res) => {
  try {
    const { alunoId } = req.params;
    const { data_inicio, data_fim } = req.query;

    let query = supabaseAdmin
      .from('presencas')
      .select('*')
      .eq('aluno_id', alunoId)
      .order('data', { ascending: false });

    if (data_inicio) {
      query = query.gte('data', data_inicio);
    }

    if (data_fim) {
      query = query.lte('data', data_fim);
    }

    const { data: presencas, error } = await query;

    if (error) throw error;

    res.json({ presencas });
  } catch (error) {
    console.error('Erro ao buscar presenças do aluno:', error);
    res.status(500).json({ error: 'Erro ao buscar presenças do aluno' });
  }
};

// POST /api/presencas - Criar nova presença
export const criarPresenca = async (req, res) => {
  try {
    const presencaData = req.body;

    const { data: presenca, error } = await supabaseAdmin
      .from('presencas')
      .insert([presencaData])
      .select()
      .single();

    if (error) throw error;

    res.status(201).json({ presenca });
  } catch (error) {
    console.error('Erro ao criar presença:', error);
    res.status(500).json({ error: 'Erro ao criar presença' });
  }
};

// PUT /api/presencas/:id - Atualizar presença
export const atualizarPresenca = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const { data: presenca, error } = await supabaseAdmin
      .from('presencas')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    res.json({ presenca });
  } catch (error) {
    console.error('Erro ao atualizar presença:', error);
    res.status(500).json({ error: 'Erro ao atualizar presença' });
  }
};

// DELETE /api/presencas/:id - Deletar presença
export const deletarPresenca = async (req, res) => {
  try {
    const { id } = req.params;

    const { error } = await supabaseAdmin
      .from('presencas')
      .delete()
      .eq('id', id);

    if (error) throw error;

    res.json({ message: 'Presença deletada com sucesso' });
  } catch (error) {
    console.error('Erro ao deletar presença:', error);
    res.status(500).json({ error: 'Erro ao deletar presença' });
  }
};
