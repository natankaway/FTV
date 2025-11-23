import { supabaseAdmin } from '../config/supabase.js';

// GET /api/professores - Listar todos os professores
export const listarProfessores = async (req, res) => {
  try {
    // Primeiro buscar professores
    const { data: professores, error } = await supabaseAdmin
      .from('professores')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Erro na query professores:', error);
      throw error;
    }

    // Buscar dados dos usuários para cada professor
    const professoresComDados = await Promise.all(
      professores.map(async (professor) => {
        let nome = '', email = '', telefone = '', ativo = true, unidade = '';

        // Buscar dados do usuário
        if (professor.usuario_id) {
          const { data: usuario } = await supabaseAdmin
            .from('usuarios')
            .select('nome, email, telefone, ativo')
            .eq('id', professor.usuario_id)
            .single();

          if (usuario) {
            nome = usuario.nome || '';
            email = usuario.email || '';
            telefone = usuario.telefone || '';
            ativo = usuario.ativo ?? true;
          }
        }

        // Buscar nome da unidade
        if (professor.unidade_principal_id) {
          const { data: unidadeData } = await supabaseAdmin
            .from('unidades')
            .select('nome')
            .eq('id', professor.unidade_principal_id)
            .single();

          if (unidadeData) {
            unidade = unidadeData.nome || '';
          }
        }

        return {
          ...professor,
          nome,
          email,
          telefone,
          ativo,
          unidade
        };
      })
    );

    res.json({ professores: professoresComDados });
  } catch (error) {
    console.error('Erro ao listar professores:', error);
    res.status(500).json({ error: 'Erro ao listar professores', message: error.message });
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
