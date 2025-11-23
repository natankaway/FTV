import { supabaseAdmin } from '../config/supabase.js';

export const listarGestores = async (req, res) => {
  try {
    const { data: gestores, error } = await supabaseAdmin
      .from('gestores')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) throw error;
    res.json({ gestores });
  } catch (error) {
    console.error('Erro ao listar gestores:', error);
    res.status(500).json({ error: 'Erro ao listar gestores' });
  }
};

export const buscarGestor = async (req, res) => {
  try {
    const { id } = req.params;
    const { data: gestor, error } = await supabaseAdmin
      .from('gestores')
      .select('*')
      .eq('id', id)
      .single();
    if (error) throw error;
    res.json({ gestor });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar gestor' });
  }
};

export const criarGestor = async (req, res) => {
  try {
    const { data: gestor, error } = await supabaseAdmin
      .from('gestores')
      .insert([req.body])
      .select()
      .single();
    if (error) throw error;
    res.status(201).json({ gestor });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao criar gestor' });
  }
};

export const atualizarGestor = async (req, res) => {
  try {
    const { id } = req.params;
    const { data: gestor, error } = await supabaseAdmin
      .from('gestores')
      .update(req.body)
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    res.json({ gestor });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao atualizar gestor' });
  }
};

export const deletarGestor = async (req, res) => {
  try {
    const { id } = req.params;
    const { error } = await supabaseAdmin.from('gestores').delete().eq('id', id);
    if (error) throw error;
    res.json({ message: 'Gestor deletado' });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao deletar gestor' });
  }
};
