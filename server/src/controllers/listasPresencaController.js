import { supabaseAdmin } from '../config/supabase.js';

// GET /api/listas-presenca - Listar todas as listas de presença
export const getListasPresenca = async (req, res) => {
  try {
    const { unidade_id, status, tipo, data_inicio, data_fim } = req.query;

    let query = supabaseAdmin
      .from('listas_presenca')
      .select(`
        *,
        unidade:unidades(id, nome),
        pre_checkins(
          id,
          aluno_id,
          horario_checkin,
          cancelado,
          motivo_cancelamento,
          aluno:alunos(id, usuario:usuarios(nome, email))
        ),
        presencas_confirmadas(
          id,
          aluno_id,
          tipo,
          status,
          observacoes,
          aluno:alunos(id, usuario:usuarios(nome, email))
        )
      `)
      .order('data', { ascending: false })
      .order('hora_inicio', { ascending: false });

    // Filtros
    if (unidade_id) {
      query = query.eq('unidade_id', unidade_id);
    }

    if (status) {
      query = query.eq('status', status);
    }

    if (tipo) {
      query = query.eq('tipo', tipo);
    }

    if (data_inicio) {
      query = query.gte('data', data_inicio);
    }

    if (data_fim) {
      query = query.lte('data', data_fim);
    }

    const { data, error } = await query;

    if (error) throw error;

    res.json({
      success: true,
      count: data.length,
      listas: data
    });

  } catch (error) {
    console.error('Erro ao buscar listas de presença:', error);
    res.status(500).json({
      error: 'Erro ao buscar listas de presença',
      message: error.message
    });
  }
};

// GET /api/listas-presenca/:id - Buscar lista por ID
export const getListaPresencaById = async (req, res) => {
  try {
    const { id } = req.params;

    const { data, error } = await supabaseAdmin
      .from('listas_presenca')
      .select(`
        *,
        unidade:unidades(*),
        pre_checkins(
          *,
          aluno:alunos(
            id,
            usuario:usuarios(nome, email, telefone),
            nivel
          )
        ),
        presencas_confirmadas(
          *,
          aluno:alunos(
            id,
            usuario:usuarios(nome, email, telefone),
            nivel
          )
        )
      `)
      .eq('id', id)
      .single();

    if (error) throw error;

    if (!data) {
      return res.status(404).json({
        error: 'Lista de presença não encontrada'
      });
    }

    res.json({
      success: true,
      lista: data
    });

  } catch (error) {
    console.error('Erro ao buscar lista de presença:', error);
    res.status(500).json({
      error: 'Erro ao buscar lista de presença',
      message: error.message
    });
  }
};

// POST /api/listas-presenca - Criar nova lista de presença
export const createListaPresenca = async (req, res) => {
  try {
    const {
      data: dataAula,
      hora_inicio,
      hora_fim,
      unidade_id,
      tipo,
      capacidade,
      nivel_aula_id,
      professor_id,
      observacoes
    } = req.body;

    // Validações
    if (!dataAula || !hora_inicio || !hora_fim || !unidade_id || !tipo) {
      return res.status(400).json({
        error: 'Dados incompletos',
        message: 'Data, hora início, hora fim, unidade e tipo são obrigatórios'
      });
    }

    const { data, error } = await supabaseAdmin
      .from('listas_presenca')
      .insert({
        data: dataAula,
        hora_inicio,
        hora_fim,
        unidade_id,
        tipo,
        capacidade: capacidade || 20,
        nivel_aula_id,
        professor_id,
        observacoes,
        status: 'aberta'
      })
      .select(`
        *,
        unidade:unidades(nome)
      `)
      .single();

    if (error) throw error;

    res.status(201).json({
      success: true,
      message: 'Lista de presença criada com sucesso',
      lista: data
    });

  } catch (error) {
    console.error('Erro ao criar lista de presença:', error);
    res.status(500).json({
      error: 'Erro ao criar lista de presença',
      message: error.message
    });
  }
};

// PUT /api/listas-presenca/:id - Atualizar lista de presença
export const updateListaPresenca = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const { data, error } = await supabaseAdmin
      .from('listas_presenca')
      .update(updateData)
      .eq('id', id)
      .select(`
        *,
        unidade:unidades(nome)
      `)
      .single();

    if (error) throw error;

    res.json({
      success: true,
      message: 'Lista de presença atualizada com sucesso',
      lista: data
    });

  } catch (error) {
    console.error('Erro ao atualizar lista de presença:', error);
    res.status(500).json({
      error: 'Erro ao atualizar lista de presença',
      message: error.message
    });
  }
};

// DELETE /api/listas-presenca/:id - Deletar lista de presença
export const deleteListaPresenca = async (req, res) => {
  try {
    const { id } = req.params;

    // Verificar se lista existe
    const { data: lista } = await supabaseAdmin
      .from('listas_presenca')
      .select('id')
      .eq('id', id)
      .single();

    if (!lista) {
      return res.status(404).json({
        error: 'Lista de presença não encontrada'
      });
    }

    // Deletar lista (cascade deleta pre_checkins e presencas_confirmadas)
    const { error } = await supabaseAdmin
      .from('listas_presenca')
      .delete()
      .eq('id', id);

    if (error) throw error;

    res.json({
      success: true,
      message: 'Lista de presença deletada com sucesso'
    });

  } catch (error) {
    console.error('Erro ao deletar lista de presença:', error);
    res.status(500).json({
      error: 'Erro ao deletar lista de presença',
      message: error.message
    });
  }
};

// POST /api/listas-presenca/:id/pre-checkin - Fazer pre-checkin
export const fazerPreCheckin = async (req, res) => {
  try {
    const { id: lista_presenca_id } = req.params;
    const { aluno_id } = req.body;

    // Validações
    if (!aluno_id) {
      return res.status(400).json({
        error: 'Aluno ID é obrigatório'
      });
    }

    // Verificar se lista existe e está aberta
    const { data: lista } = await supabaseAdmin
      .from('listas_presenca')
      .select('*')
      .eq('id', lista_presenca_id)
      .single();

    if (!lista) {
      return res.status(404).json({
        error: 'Lista de presença não encontrada'
      });
    }

    if (lista.status !== 'aberta') {
      return res.status(400).json({
        error: 'Lista de presença não está aberta para check-in'
      });
    }

    // Verificar capacidade
    const { data: preCheckins } = await supabaseAdmin
      .from('pre_checkins')
      .select('id')
      .eq('lista_presenca_id', lista_presenca_id)
      .eq('cancelado', false);

    if (lista.capacidade && preCheckins && preCheckins.length >= lista.capacidade) {
      return res.status(400).json({
        error: 'Lista cheia',
        message: 'Capacidade máxima atingida'
      });
    }

    // Verificar se já fez check-in
    const { data: existing } = await supabaseAdmin
      .from('pre_checkins')
      .select('id')
      .eq('lista_presenca_id', lista_presenca_id)
      .eq('aluno_id', aluno_id)
      .single();

    if (existing) {
      return res.status(400).json({
        error: 'Check-in já realizado',
        message: 'Aluno já fez check-in nesta lista'
      });
    }

    // Fazer pre-checkin
    const { data, error } = await supabaseAdmin
      .from('pre_checkins')
      .insert({
        lista_presenca_id,
        aluno_id,
        horario_checkin: new Date().toISOString()
      })
      .select(`
        *,
        aluno:alunos(id, usuario:usuarios(nome, email))
      `)
      .single();

    if (error) throw error;

    res.status(201).json({
      success: true,
      message: 'Pre-check-in realizado com sucesso',
      preCheckin: data
    });

  } catch (error) {
    console.error('Erro ao fazer pre-check-in:', error);
    res.status(500).json({
      error: 'Erro ao fazer pre-check-in',
      message: error.message
    });
  }
};

// DELETE /api/listas-presenca/:id/pre-checkin/:checkinId - Cancelar pre-checkin
export const cancelarPreCheckin = async (req, res) => {
  try {
    const { checkinId } = req.params;
    const { motivo_cancelamento } = req.body;

    const { data, error } = await supabaseAdmin
      .from('pre_checkins')
      .update({
        cancelado: true,
        motivo_cancelamento
      })
      .eq('id', checkinId)
      .select()
      .single();

    if (error) throw error;

    res.json({
      success: true,
      message: 'Pre-check-in cancelado com sucesso',
      preCheckin: data
    });

  } catch (error) {
    console.error('Erro ao cancelar pre-check-in:', error);
    res.status(500).json({
      error: 'Erro ao cancelar pre-check-in',
      message: error.message
    });
  }
};

// POST /api/listas-presenca/:id/confirmar-presenca - Confirmar presença
export const confirmarPresenca = async (req, res) => {
  try {
    const { id: lista_presenca_id } = req.params;
    const { aluno_id, tipo, status, observacoes } = req.body;

    // Validações
    if (!aluno_id || !tipo || !status) {
      return res.status(400).json({
        error: 'Dados incompletos',
        message: 'Aluno, tipo e status são obrigatórios'
      });
    }

    const { data, error } = await supabaseAdmin
      .from('presencas_confirmadas')
      .insert({
        lista_presenca_id,
        aluno_id,
        tipo,
        status,
        observacoes
      })
      .select(`
        *,
        aluno:alunos(id, usuario:usuarios(nome, email))
      `)
      .single();

    if (error) throw error;

    res.status(201).json({
      success: true,
      message: 'Presença confirmada com sucesso',
      presenca: data
    });

  } catch (error) {
    console.error('Erro ao confirmar presença:', error);
    res.status(500).json({
      error: 'Erro ao confirmar presença',
      message: error.message
    });
  }
};
