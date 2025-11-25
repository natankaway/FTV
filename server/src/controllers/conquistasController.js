import { supabaseAdmin } from '../config/supabase.js';

// GET /api/conquistas - Listar todas as conquistas
export const getConquistas = async (req, res) => {
  try {
    const { aluno_id, desbloqueada, tipo, dificuldade } = req.query;

    let query = supabaseAdmin
      .from('conquistas')
      .select(`
        *,
        aluno:alunos(
          id,
          usuario:usuarios(nome, email)
        )
      `)
      .order('desbloqueada_em', { ascending: false, nullsFirst: false });

    // Filtros
    if (aluno_id) {
      query = query.eq('aluno_id', aluno_id);
    }

    if (desbloqueada === 'true') {
      query = query.not('desbloqueada_em', 'is', null);
    } else if (desbloqueada === 'false') {
      query = query.is('desbloqueada_em', null);
    }

    if (tipo) {
      query = query.eq('tipo', tipo);
    }

    if (dificuldade) {
      query = query.eq('dificuldade', dificuldade);
    }

    const { data, error } = await query;

    if (error) throw error;

    res.json({
      success: true,
      count: data.length,
      conquistas: data
    });

  } catch (error) {
    console.error('Erro ao buscar conquistas:', error);
    res.status(500).json({
      error: 'Erro ao buscar conquistas',
      message: error.message
    });
  }
};

// GET /api/conquistas/:id - Buscar conquista por ID
export const getConquistaById = async (req, res) => {
  try {
    const { id } = req.params;

    const { data, error } = await supabaseAdmin
      .from('conquistas')
      .select(`
        *,
        aluno:alunos(
          id,
          usuario:usuarios(nome, email, telefone)
        )
      `)
      .eq('id', id)
      .single();

    if (error) throw error;

    if (!data) {
      return res.status(404).json({
        error: 'Conquista não encontrada'
      });
    }

    res.json({
      success: true,
      conquista: data
    });

  } catch (error) {
    console.error('Erro ao buscar conquista:', error);
    res.status(500).json({
      error: 'Erro ao buscar conquista',
      message: error.message
    });
  }
};

// GET /api/conquistas/aluno/:alunoId - Listar conquistas de um aluno
export const getConquistasAluno = async (req, res) => {
  try {
    const { alunoId } = req.params;

    const { data, error } = await supabaseAdmin
      .from('conquistas')
      .select('*')
      .eq('aluno_id', alunoId)
      .order('desbloqueada_em', { ascending: false, nullsFirst: false });

    if (error) throw error;

    // Separar conquistas desbloqueadas e bloqueadas
    const desbloqueadas = data.filter(c => c.desbloqueada_em);
    const bloqueadas = data.filter(c => !c.desbloqueada_em);

    res.json({
      success: true,
      total: data.length,
      desbloqueadas: desbloqueadas.length,
      bloqueadas: bloqueadas.length,
      conquistas: {
        desbloqueadas,
        bloqueadas
      }
    });

  } catch (error) {
    console.error('Erro ao buscar conquistas do aluno:', error);
    res.status(500).json({
      error: 'Erro ao buscar conquistas do aluno',
      message: error.message
    });
  }
};

// POST /api/conquistas - Criar nova conquista
export const createConquista = async (req, res) => {
  try {
    const {
      aluno_id,
      titulo,
      descricao,
      tipo,
      dificuldade,
      icone,
      condicao
    } = req.body;

    // Validações
    if (!aluno_id || !titulo || !tipo || !dificuldade) {
      return res.status(400).json({
        error: 'Dados incompletos',
        message: 'Aluno, título, tipo e dificuldade são obrigatórios'
      });
    }

    const { data, error } = await supabaseAdmin
      .from('conquistas')
      .insert({
        aluno_id,
        titulo,
        descricao,
        tipo,
        dificuldade,
        icone,
        condicao
      })
      .select(`
        *,
        aluno:alunos(id, usuario:usuarios(nome))
      `)
      .single();

    if (error) throw error;

    res.status(201).json({
      success: true,
      message: 'Conquista criada com sucesso',
      conquista: data
    });

  } catch (error) {
    console.error('Erro ao criar conquista:', error);
    res.status(500).json({
      error: 'Erro ao criar conquista',
      message: error.message
    });
  }
};

// PUT /api/conquistas/:id/desbloquear - Desbloquear conquista
export const desbloquearConquista = async (req, res) => {
  try {
    const { id } = req.params;

    const { data, error } = await supabaseAdmin
      .from('conquistas')
      .update({
        desbloqueada_em: new Date().toISOString()
      })
      .eq('id', id)
      .select(`
        *,
        aluno:alunos(id, usuario:usuarios(nome, email))
      `)
      .single();

    if (error) throw error;

    res.json({
      success: true,
      message: 'Conquista desbloqueada com sucesso!',
      conquista: data
    });

  } catch (error) {
    console.error('Erro ao desbloquear conquista:', error);
    res.status(500).json({
      error: 'Erro ao desbloquear conquista',
      message: error.message
    });
  }
};

// PUT /api/conquistas/:id - Atualizar conquista
export const updateConquista = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const { data, error } = await supabaseAdmin
      .from('conquistas')
      .update(updateData)
      .eq('id', id)
      .select(`
        *,
        aluno:alunos(id, usuario:usuarios(nome))
      `)
      .single();

    if (error) throw error;

    res.json({
      success: true,
      message: 'Conquista atualizada com sucesso',
      conquista: data
    });

  } catch (error) {
    console.error('Erro ao atualizar conquista:', error);
    res.status(500).json({
      error: 'Erro ao atualizar conquista',
      message: error.message
    });
  }
};

// DELETE /api/conquistas/:id - Deletar conquista
export const deleteConquista = async (req, res) => {
  try {
    const { id } = req.params;

    const { error } = await supabaseAdmin
      .from('conquistas')
      .delete()
      .eq('id', id);

    if (error) throw error;

    res.json({
      success: true,
      message: 'Conquista deletada com sucesso'
    });

  } catch (error) {
    console.error('Erro ao deletar conquista:', error);
    res.status(500).json({
      error: 'Erro ao deletar conquista',
      message: error.message
    });
  }
};
