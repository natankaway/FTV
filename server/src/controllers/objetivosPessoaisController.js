import { supabaseAdmin } from '../config/supabase.js';

// GET /api/objetivos-pessoais - Listar todos os objetivos
export const getObjetivos = async (req, res) => {
  try {
    const { aluno_id, status, tipo } = req.query;

    let query = supabaseAdmin
      .from('objetivos_pessoais')
      .select(`
        *,
        aluno:alunos(
          id,
          usuario:usuarios(nome, email)
        )
      `)
      .order('created_at', { ascending: false });

    // Filtros
    if (aluno_id) {
      query = query.eq('aluno_id', aluno_id);
    }

    if (status) {
      query = query.eq('status', status);
    }

    if (tipo) {
      query = query.eq('tipo', tipo);
    }

    const { data, error } = await query;

    if (error) throw error;

    res.json({
      success: true,
      count: data.length,
      objetivos: data
    });

  } catch (error) {
    console.error('Erro ao buscar objetivos:', error);
    res.status(500).json({
      error: 'Erro ao buscar objetivos',
      message: error.message
    });
  }
};

// GET /api/objetivos-pessoais/:id - Buscar objetivo por ID
export const getObjetivoById = async (req, res) => {
  try {
    const { id } = req.params;

    const { data, error } = await supabaseAdmin
      .from('objetivos_pessoais')
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
        error: 'Objetivo não encontrado'
      });
    }

    res.json({
      success: true,
      objetivo: data
    });

  } catch (error) {
    console.error('Erro ao buscar objetivo:', error);
    res.status(500).json({
      error: 'Erro ao buscar objetivo',
      message: error.message
    });
  }
};

// GET /api/objetivos-pessoais/aluno/:alunoId - Listar objetivos de um aluno
export const getObjetivosAluno = async (req, res) => {
  try {
    const { alunoId } = req.params;
    const { status } = req.query;

    let query = supabaseAdmin
      .from('objetivos_pessoais')
      .select('*')
      .eq('aluno_id', alunoId)
      .order('created_at', { ascending: false });

    if (status) {
      query = query.eq('status', status);
    }

    const { data, error } = await query;

    if (error) throw error;

    // Estatísticas
    const ativos = data.filter(o => o.status === 'ativo').length;
    const concluidos = data.filter(o => o.status === 'concluido').length;
    const cancelados = data.filter(o => o.status === 'cancelado').length;

    res.json({
      success: true,
      total: data.length,
      stats: {
        ativos,
        concluidos,
        cancelados,
        taxa_conclusao: data.length > 0 ? ((concluidos / (concluidos + cancelados + ativos)) * 100).toFixed(1) : 0
      },
      objetivos: data
    });

  } catch (error) {
    console.error('Erro ao buscar objetivos do aluno:', error);
    res.status(500).json({
      error: 'Erro ao buscar objetivos do aluno',
      message: error.message
    });
  }
};

// POST /api/objetivos-pessoais - Criar novo objetivo
export const createObjetivo = async (req, res) => {
  try {
    const {
      aluno_id,
      titulo,
      descricao,
      tipo,
      meta,
      unidade,
      prazo
    } = req.body;

    // Validações
    if (!aluno_id || !titulo || !tipo || !meta) {
      return res.status(400).json({
        error: 'Dados incompletos',
        message: 'Aluno, título, tipo e meta são obrigatórios'
      });
    }

    if (meta <= 0) {
      return res.status(400).json({
        error: 'Meta inválida',
        message: 'Meta deve ser maior que zero'
      });
    }

    const { data, error } = await supabaseAdmin
      .from('objetivos_pessoais')
      .insert({
        aluno_id,
        titulo,
        descricao,
        tipo,
        meta,
        progresso: 0,
        unidade,
        prazo,
        status: 'ativo'
      })
      .select(`
        *,
        aluno:alunos(id, usuario:usuarios(nome))
      `)
      .single();

    if (error) throw error;

    res.status(201).json({
      success: true,
      message: 'Objetivo criado com sucesso',
      objetivo: data
    });

  } catch (error) {
    console.error('Erro ao criar objetivo:', error);
    res.status(500).json({
      error: 'Erro ao criar objetivo',
      message: error.message
    });
  }
};

// PUT /api/objetivos-pessoais/:id - Atualizar objetivo
export const updateObjetivo = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    // Se progresso >= meta, marcar como concluído
    if (updateData.progresso !== undefined && updateData.meta !== undefined) {
      if (updateData.progresso >= updateData.meta) {
        updateData.status = 'concluido';
      }
    }

    const { data, error } = await supabaseAdmin
      .from('objetivos_pessoais')
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
      message: 'Objetivo atualizado com sucesso',
      objetivo: data
    });

  } catch (error) {
    console.error('Erro ao atualizar objetivo:', error);
    res.status(500).json({
      error: 'Erro ao atualizar objetivo',
      message: error.message
    });
  }
};

// PUT /api/objetivos-pessoais/:id/progresso - Atualizar progresso do objetivo
export const atualizarProgresso = async (req, res) => {
  try {
    const { id } = req.params;
    const { progresso, incremento } = req.body;

    // Buscar objetivo atual
    const { data: objetivoAtual } = await supabaseAdmin
      .from('objetivos_pessoais')
      .select('*')
      .eq('id', id)
      .single();

    if (!objetivoAtual) {
      return res.status(404).json({
        error: 'Objetivo não encontrado'
      });
    }

    // Calcular novo progresso
    let novoProgresso = progresso !== undefined ? progresso : objetivoAtual.progresso;

    if (incremento !== undefined) {
      novoProgresso += incremento;
    }

    // Garantir que não ultrapasse a meta
    novoProgresso = Math.min(novoProgresso, objetivoAtual.meta);

    // Determinar status
    const novoStatus = novoProgresso >= objetivoAtual.meta ? 'concluido' : 'ativo';

    const { data, error } = await supabaseAdmin
      .from('objetivos_pessoais')
      .update({
        progresso: novoProgresso,
        status: novoStatus
      })
      .eq('id', id)
      .select(`
        *,
        aluno:alunos(id, usuario:usuarios(nome, email))
      `)
      .single();

    if (error) throw error;

    const mensagem = novoStatus === 'concluido'
      ? 'Parabéns! Objetivo concluído!'
      : 'Progresso atualizado com sucesso';

    res.json({
      success: true,
      message: mensagem,
      objetivo: data
    });

  } catch (error) {
    console.error('Erro ao atualizar progresso:', error);
    res.status(500).json({
      error: 'Erro ao atualizar progresso',
      message: error.message
    });
  }
};

// PUT /api/objetivos-pessoais/:id/cancelar - Cancelar objetivo
export const cancelarObjetivo = async (req, res) => {
  try {
    const { id } = req.params;

    const { data, error } = await supabaseAdmin
      .from('objetivos_pessoais')
      .update({
        status: 'cancelado'
      })
      .eq('id', id)
      .select(`
        *,
        aluno:alunos(id, usuario:usuarios(nome))
      `)
      .single();

    if (error) throw error;

    res.json({
      success: true,
      message: 'Objetivo cancelado',
      objetivo: data
    });

  } catch (error) {
    console.error('Erro ao cancelar objetivo:', error);
    res.status(500).json({
      error: 'Erro ao cancelar objetivo',
      message: error.message
    });
  }
};

// DELETE /api/objetivos-pessoais/:id - Deletar objetivo
export const deleteObjetivo = async (req, res) => {
  try {
    const { id } = req.params;

    const { error } = await supabaseAdmin
      .from('objetivos_pessoais')
      .delete()
      .eq('id', id);

    if (error) throw error;

    res.json({
      success: true,
      message: 'Objetivo deletado com sucesso'
    });

  } catch (error) {
    console.error('Erro ao deletar objetivo:', error);
    res.status(500).json({
      error: 'Erro ao deletar objetivo',
      message: error.message
    });
  }
};
