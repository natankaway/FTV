import { supabaseAdmin } from '../config/supabase.js';

export const listarAulasExperimentais = async (req, res) => {
  try {
    const { data: aulasExperimentais, error } = await supabaseAdmin
      .from('aulas_experimentais')
      .select('*')
      .order('data_agendamento', { ascending: false });
    if (error) throw error;
    res.json({ aulasExperimentais });
  } catch (error) {
    console.error('Erro ao listar aulas experimentais:', error);
    res.status(500).json({ error: 'Erro ao listar aulas experimentais' });
  }
};

export const buscarAulaExperimental = async (req, res) => {
  try {
    const { id } = req.params;
    const { data: aulaExperimental, error } = await supabaseAdmin
      .from('aulas_experimentais')
      .select('*')
      .eq('id', id)
      .single();
    if (error) throw error;
    res.json({ aulaExperimental });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar aula experimental' });
  }
};

export const criarAulaExperimental = async (req, res) => {
  try {
    const { data: aulaExperimental, error } = await supabaseAdmin
      .from('aulas_experimentais')
      .insert([req.body])
      .select()
      .single();
    if (error) throw error;
    res.status(201).json({ aulaExperimental });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao criar aula experimental' });
  }
};

export const atualizarAulaExperimental = async (req, res) => {
  try {
    const { id } = req.params;
    const { data: aulaExperimental, error } = await supabaseAdmin
      .from('aulas_experimentais')
      .update(req.body)
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    res.json({ aulaExperimental });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao atualizar aula experimental' });
  }
};

export const deletarAulaExperimental = async (req, res) => {
  try {
    const { id } = req.params;
    const { error } = await supabaseAdmin.from('aulas_experimentais').delete().eq('id', id);
    if (error) throw error;
    res.json({ message: 'Aula experimental deletada' });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao deletar aula experimental' });
  }
};
