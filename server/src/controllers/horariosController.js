import { supabaseAdmin } from '../config/supabase.js';

export const listarHorarios = async (req, res) => {
  try {
    const { data: horarios, error } = await supabaseAdmin
      .from('horarios_fixos')
      .select('*')
      .order('hora_inicio', { ascending: true });
    if (error) throw error;
    res.json({ horarios });
  } catch (error) {
    console.error('Erro ao listar horários:', error);
    res.status(500).json({ error: 'Erro ao listar horários' });
  }
};

export const buscarHorario = async (req, res) => {
  try {
    const { id } = req.params;
    const { data: horario, error } = await supabaseAdmin
      .from('horarios_fixos')
      .select('*')
      .eq('id', id)
      .single();
    if (error) throw error;
    res.json({ horario });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar horário' });
  }
};

export const criarHorario = async (req, res) => {
  try {
    const { data: horario, error } = await supabaseAdmin
      .from('horarios_fixos')
      .insert([req.body])
      .select()
      .single();
    if (error) throw error;
    res.status(201).json({ horario });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao criar horário' });
  }
};

export const atualizarHorario = async (req, res) => {
  try {
    const { id } = req.params;
    const { data: horario, error } = await supabaseAdmin
      .from('horarios_fixos')
      .update(req.body)
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    res.json({ horario });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao atualizar horário' });
  }
};

export const deletarHorario = async (req, res) => {
  try {
    const { id } = req.params;
    const { error } = await supabaseAdmin.from('horarios_fixos').delete().eq('id', id);
    if (error) throw error;
    res.json({ message: 'Horário deletado' });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao deletar horário' });
  }
};
