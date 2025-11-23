import { supabaseAdmin } from '../config/supabase.js';

export const listarExercicios = async (req, res) => {
  try {
    const { data: exercicios, error } = await supabaseAdmin
      .from('exercicios')
      .select('*')
      .order('nome', { ascending: true });
    if (error) throw error;
    res.json({ exercicios });
  } catch (error) {
    console.error('Erro ao listar exercícios:', error);
    res.status(500).json({ error: 'Erro ao listar exercícios' });
  }
};

export const buscarExercicio = async (req, res) => {
  try {
    const { id } = req.params;
    const { data: exercicio, error } = await supabaseAdmin
      .from('exercicios')
      .select('*')
      .eq('id', id)
      .single();
    if (error) throw error;
    res.json({ exercicio });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar exercício' });
  }
};

export const criarExercicio = async (req, res) => {
  try {
    const { data: exercicio, error } = await supabaseAdmin
      .from('exercicios')
      .insert([req.body])
      .select()
      .single();
    if (error) throw error;
    res.status(201).json({ exercicio });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao criar exercício' });
  }
};

export const atualizarExercicio = async (req, res) => {
  try {
    const { id } = req.params;
    const { data: exercicio, error } = await supabaseAdmin
      .from('exercicios')
      .update(req.body)
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    res.json({ exercicio });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao atualizar exercício' });
  }
};

export const deletarExercicio = async (req, res) => {
  try {
    const { id } = req.params;
    const { error } = await supabaseAdmin.from('exercicios').delete().eq('id', id);
    if (error) throw error;
    res.json({ message: 'Exercício deletado' });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao deletar exercício' });
  }
};
