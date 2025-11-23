import { supabaseAdmin } from '../config/supabase.js';

export const listarTreinos = async (req, res) => {
  try {
    const { data: treinos, error } = await supabaseAdmin
      .from('treinos')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) throw error;
    res.json({ treinos });
  } catch (error) {
    console.error('Erro ao listar treinos:', error);
    res.status(500).json({ error: 'Erro ao listar treinos' });
  }
};

export const buscarTreino = async (req, res) => {
  try {
    const { id } = req.params;
    const { data: treino, error } = await supabaseAdmin
      .from('treinos')
      .select('*')
      .eq('id', id)
      .single();
    if (error) throw error;
    res.json({ treino });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar treino' });
  }
};

export const criarTreino = async (req, res) => {
  try {
    const { data: treino, error } = await supabaseAdmin
      .from('treinos')
      .insert([req.body])
      .select()
      .single();
    if (error) throw error;
    res.status(201).json({ treino });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao criar treino' });
  }
};

export const atualizarTreino = async (req, res) => {
  try {
    const { id } = req.params;
    const { data: treino, error } = await supabaseAdmin
      .from('treinos')
      .update(req.body)
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    res.json({ treino });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao atualizar treino' });
  }
};

export const deletarTreino = async (req, res) => {
  try {
    const { id } = req.params;
    const { error } = await supabaseAdmin.from('treinos').delete().eq('id', id);
    if (error) throw error;
    res.json({ message: 'Treino deletado' });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao deletar treino' });
  }
};
