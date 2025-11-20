import { supabaseAdmin } from '../config/supabase.js';

// GET /api/unidades - Listar todas as unidades
export const listarUnidades = async (req, res) => {
  try {
    const { data: unidades, error } = await supabaseAdmin
      .from('unidades')
      .select('*')
      .order('nome', { ascending: true });

    if (error) throw error;

    res.json({ unidades });
  } catch (error) {
    console.error('Erro ao listar unidades:', error);
    res.status(500).json({ error: 'Erro ao listar unidades' });
  }
};

// GET /api/unidades/:id - Buscar unidade por ID
export const buscarUnidade = async (req, res) => {
  try {
    const { id } = req.params;

    const { data: unidade, error } = await supabaseAdmin
      .from('unidades')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;

    if (!unidade) {
      return res.status(404).json({ error: 'Unidade não encontrada' });
    }

    res.json({ unidade });
  } catch (error) {
    console.error('Erro ao buscar unidade:', error);
    res.status(500).json({ error: 'Erro ao buscar unidade' });
  }
};

// POST /api/unidades - Criar nova unidade
export const criarUnidade = async (req, res) => {
  try {
    const unidadeData = req.body;

    const { data: unidade, error } = await supabaseAdmin
      .from('unidades')
      .insert([unidadeData])
      .select()
      .single();

    if (error) throw error;

    res.status(201).json({ unidade });
  } catch (error) {
    console.error('Erro ao criar unidade:', error);
    res.status(500).json({ error: 'Erro ao criar unidade' });
  }
};

// PUT /api/unidades/:id - Atualizar unidade
export const atualizarUnidade = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const { data: unidade, error } = await supabaseAdmin
      .from('unidades')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    res.json({ unidade });
  } catch (error) {
    console.error('Erro ao atualizar unidade:', error);
    res.status(500).json({ error: 'Erro ao atualizar unidade' });
  }
};

// DELETE /api/unidades/:id - Deletar unidade
export const deletarUnidade = async (req, res) => {
  try {
    const { id } = req.params;

    const { error } = await supabaseAdmin
      .from('unidades')
      .delete()
      .eq('id', id);

    if (error) throw error;

    res.json({ message: 'Unidade deletada com sucesso' });
  } catch (error) {
    console.error('Erro ao deletar unidade:', error);
    res.status(500).json({ error: 'Erro ao deletar unidade' });
  }
};
