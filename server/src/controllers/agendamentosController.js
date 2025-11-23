import { supabaseAdmin } from '../config/supabase.js';

export const listarAgendamentos = async (req, res) => {
  try {
    const { data: agendamentos, error } = await supabaseAdmin
      .from('agendamentos')
      .select('*')
      .order('data', { ascending: false });
    if (error) throw error;
    res.json({ agendamentos });
  } catch (error) {
    console.error('Erro ao listar agendamentos:', error);
    res.status(500).json({ error: 'Erro ao listar agendamentos' });
  }
};

export const buscarAgendamento = async (req, res) => {
  try {
    const { id } = req.params;
    const { data: agendamento, error } = await supabaseAdmin
      .from('agendamentos')
      .select('*')
      .eq('id', id)
      .single();
    if (error) throw error;
    res.json({ agendamento });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar agendamento' });
  }
};

export const criarAgendamento = async (req, res) => {
  try {
    const { data: agendamento, error } = await supabaseAdmin
      .from('agendamentos')
      .insert([req.body])
      .select()
      .single();
    if (error) throw error;
    res.status(201).json({ agendamento });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao criar agendamento' });
  }
};

export const atualizarAgendamento = async (req, res) => {
  try {
    const { id } = req.params;
    const { data: agendamento, error } = await supabaseAdmin
      .from('agendamentos')
      .update(req.body)
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    res.json({ agendamento });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao atualizar agendamento' });
  }
};

export const deletarAgendamento = async (req, res) => {
  try {
    const { id } = req.params;
    const { error } = await supabaseAdmin.from('agendamentos').delete().eq('id', id);
    if (error) throw error;
    res.json({ message: 'Agendamento deletado' });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao deletar agendamento' });
  }
};
