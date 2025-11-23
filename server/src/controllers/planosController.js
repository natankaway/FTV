import { supabaseAdmin } from '../config/supabase.js';

// GET /api/planos - Listar todos os planos
export const listarPlanos = async (req, res) => {
  try {
    const { data: planos, error } = await supabaseAdmin
      .from('planos')
      .select('*')
      .order('preco', { ascending: true });

    if (error) {
      console.error('Erro Supabase ao listar planos:', error);
      throw error;
    }

    res.json({ planos });
  } catch (error) {
    console.error('Erro ao listar planos:', error.message, error.details);
    res.status(500).json({ error: 'Erro ao listar planos', details: error.message });
  }
};

// GET /api/planos/:id - Buscar plano por ID
export const buscarPlano = async (req, res) => {
  try {
    const { id } = req.params;

    const { data: plano, error } = await supabaseAdmin
      .from('planos')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;

    if (!plano) {
      return res.status(404).json({ error: 'Plano não encontrado' });
    }

    res.json({ plano });
  } catch (error) {
    console.error('Erro ao buscar plano:', error);
    res.status(500).json({ error: 'Erro ao buscar plano' });
  }
};

// POST /api/planos - Criar novo plano
export const criarPlano = async (req, res) => {
  try {
    const planoData = req.body;

    const { data: plano, error } = await supabaseAdmin
      .from('planos')
      .insert([planoData])
      .select()
      .single();

    if (error) throw error;

    res.status(201).json({ plano });
  } catch (error) {
    console.error('Erro ao criar plano:', error);
    res.status(500).json({ error: 'Erro ao criar plano' });
  }
};

// PUT /api/planos/:id - Atualizar plano
export const atualizarPlano = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const { data: plano, error } = await supabaseAdmin
      .from('planos')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    res.json({ plano });
  } catch (error) {
    console.error('Erro ao atualizar plano:', error);
    res.status(500).json({ error: 'Erro ao atualizar plano' });
  }
};

// DELETE /api/planos/:id - Deletar plano
export const deletarPlano = async (req, res) => {
  try {
    const { id } = req.params;

    const { error } = await supabaseAdmin
      .from('planos')
      .delete()
      .eq('id', id);

    if (error) throw error;

    res.json({ message: 'Plano deletado com sucesso' });
  } catch (error) {
    console.error('Erro ao deletar plano:', error);
    res.status(500).json({ error: 'Erro ao deletar plano' });
  }
};
