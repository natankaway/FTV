import { supabaseAdmin } from '../config/supabase.js';

export const listarTorneios = async (req, res) => {
  try {
    const { data: torneios, error } = await supabaseAdmin
      .from('torneios')
      .select('*')
      .order('data_inicio', { ascending: false });
    if (error) throw error;
    res.json({ torneios });
  } catch (error) {
    console.error('Erro ao listar torneios:', error);
    res.status(500).json({ error: 'Erro ao listar torneios' });
  }
};

export const buscarTorneio = async (req, res) => {
  try {
    const { id } = req.params;
    const { data: torneio, error } = await supabaseAdmin
      .from('torneios')
      .select('*')
      .eq('id', id)
      .single();
    if (error) throw error;
    res.json({ torneio });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar torneio' });
  }
};

export const criarTorneio = async (req, res) => {
  try {
    const { data: torneio, error } = await supabaseAdmin
      .from('torneios')
      .insert([req.body])
      .select()
      .single();
    if (error) throw error;
    res.status(201).json({ torneio });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao criar torneio' });
  }
};

export const atualizarTorneio = async (req, res) => {
  try {
    const { id } = req.params;
    const { data: torneio, error } = await supabaseAdmin
      .from('torneios')
      .update(req.body)
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    res.json({ torneio });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao atualizar torneio' });
  }
};

export const deletarTorneio = async (req, res) => {
  try {
    const { id } = req.params;
    const { error } = await supabaseAdmin.from('torneios').delete().eq('id', id);
    if (error) throw error;
    res.json({ message: 'Torneio deletado' });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao deletar torneio' });
  }
};
