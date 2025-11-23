import { supabaseAdmin } from '../config/supabase.js';

// GET /api/professores - Listar todos os professores
export const listarProfessores = async (req, res) => {
  try {
    const { data: professores, error } = await supabaseAdmin
      .from('professores')
      .select(`
        *,
        usuario:usuarios(nome, email, telefone, ativo),
        unidade_principal:unidades(nome)
      `)
      .order('created_at', { ascending: false });

    if (error) throw error;

    // Transformar dados para achatar a estrutura do usuario
    const professoresTransformados = professores.map(professor => ({
      ...professor,
      nome: professor.usuario?.nome || '',
      email: professor.usuario?.email || '',
      telefone: professor.usuario?.telefone || '',
      ativo: professor.usuario?.ativo ?? true,
      unidade: professor.unidade_principal?.nome || ''
    }));

    res.json({ professores: professoresTransformados });
  } catch (error) {
    console.error('Erro ao listar professores:', error);
    res.status(500).json({ error: 'Erro ao listar professores' });
  }
};

// GET /api/professores/:id - Buscar professor por ID
export const buscarProfessor = async (req, res) => {
  try {
    const { id } = req.params;

    const { data: professor, error } = await supabaseAdmin
      .from('professores')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;

    if (!professor) {
      return res.status(404).json({ error: 'Professor não encontrado' });
    }

    res.json({ professor });
  } catch (error) {
    console.error('Erro ao buscar professor:', error);
    res.status(500).json({ error: 'Erro ao buscar professor' });
  }
};

// POST /api/professores - Criar novo professor
export const criarProfessor = async (req, res) => {
  try {
    const professorData = req.body;

    const { data: professor, error } = await supabaseAdmin
      .from('professores')
      .insert([professorData])
      .select()
      .single();

    if (error) throw error;

    res.status(201).json({ professor });
  } catch (error) {
    console.error('Erro ao criar professor:', error);
    res.status(500).json({ error: 'Erro ao criar professor' });
  }
};

// PUT /api/professores/:id - Atualizar professor
export const atualizarProfessor = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const { data: professor, error } = await supabaseAdmin
      .from('professores')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    res.json({ professor });
  } catch (error) {
    console.error('Erro ao atualizar professor:', error);
    res.status(500).json({ error: 'Erro ao atualizar professor' });
  }
};

// DELETE /api/professores/:id - Deletar professor
export const deletarProfessor = async (req, res) => {
  try {
    const { id } = req.params;

    const { error } = await supabaseAdmin
      .from('professores')
      .delete()
      .eq('id', id);

    if (error) throw error;

    res.json({ message: 'Professor deletado com sucesso' });
  } catch (error) {
    console.error('Erro ao deletar professor:', error);
    res.status(500).json({ error: 'Erro ao deletar professor' });
  }
};
