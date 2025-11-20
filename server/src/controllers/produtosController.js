import { supabaseAdmin } from '../config/supabase.js';

// GET /api/produtos - Listar todos os produtos
export const listarProdutos = async (req, res) => {
  try {
    const { data: produtos, error } = await supabaseAdmin
      .from('produtos')
      .select('*')
      .order('nome', { ascending: true });

    if (error) throw error;

    res.json({ produtos });
  } catch (error) {
    console.error('Erro ao listar produtos:', error);
    res.status(500).json({ error: 'Erro ao listar produtos' });
  }
};

// GET /api/produtos/:id - Buscar produto por ID
export const buscarProduto = async (req, res) => {
  try {
    const { id } = req.params;

    const { data: produto, error } = await supabaseAdmin
      .from('produtos')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;

    if (!produto) {
      return res.status(404).json({ error: 'Produto não encontrado' });
    }

    res.json({ produto });
  } catch (error) {
    console.error('Erro ao buscar produto:', error);
    res.status(500).json({ error: 'Erro ao buscar produto' });
  }
};

// POST /api/produtos - Criar novo produto
export const criarProduto = async (req, res) => {
  try {
    const produtoData = req.body;

    const { data: produto, error } = await supabaseAdmin
      .from('produtos')
      .insert([produtoData])
      .select()
      .single();

    if (error) throw error;

    res.status(201).json({ produto });
  } catch (error) {
    console.error('Erro ao criar produto:', error);
    res.status(500).json({ error: 'Erro ao criar produto' });
  }
};

// PUT /api/produtos/:id - Atualizar produto
export const atualizarProduto = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const { data: produto, error } = await supabaseAdmin
      .from('produtos')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    res.json({ produto });
  } catch (error) {
    console.error('Erro ao atualizar produto:', error);
    res.status(500).json({ error: 'Erro ao atualizar produto' });
  }
};

// DELETE /api/produtos/:id - Deletar produto
export const deletarProduto = async (req, res) => {
  try {
    const { id } = req.params;

    const { error } = await supabaseAdmin
      .from('produtos')
      .delete()
      .eq('id', id);

    if (error) throw error;

    res.json({ message: 'Produto deletado com sucesso' });
  } catch (error) {
    console.error('Erro ao deletar produto:', error);
    res.status(500).json({ error: 'Erro ao deletar produto' });
  }
};
