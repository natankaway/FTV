import { supabaseAdmin } from '../config/supabase.js';

// GET /api/avaliacoes-nivel - Listar todas as avaliações
export const getAvaliacoes = async (req, res) => {
  try {
    const { aluno_id, resultado, data_inicio, data_fim } = req.query;

    let query = supabaseAdmin
      .from('avaliacoes_nivel')
      .select(`
        *,
        aluno:alunos(
          id,
          usuario:usuarios(nome, email),
          nivel,
          nivel_atual,
          data_nivel_atual
        ),
        avaliador:usuarios(nome, email)
      `)
      .order('data_avaliacao', { ascending: false });

    // Filtros
    if (aluno_id) {
      query = query.eq('aluno_id', aluno_id);
    }

    if (resultado) {
      query = query.eq('resultado', resultado);
    }

    if (data_inicio) {
      query = query.gte('data_avaliacao', data_inicio);
    }

    if (data_fim) {
      query = query.lte('data_avaliacao', data_fim);
    }

    const { data, error } = await query;

    if (error) throw error;

    res.json({
      success: true,
      count: data.length,
      avaliacoes: data
    });

  } catch (error) {
    console.error('Erro ao buscar avaliações:', error);
    res.status(500).json({
      error: 'Erro ao buscar avaliações',
      message: error.message
    });
  }
};

// GET /api/avaliacoes-nivel/:id - Buscar avaliação por ID
export const getAvaliacaoById = async (req, res) => {
  try {
    const { id } = req.params;

    const { data, error } = await supabaseAdmin
      .from('avaliacoes_nivel')
      .select(`
        *,
        aluno:alunos(
          id,
          usuario:usuarios(nome, email, telefone),
          nivel,
          nivel_atual,
          data_nivel_atual,
          unidade:unidades(nome)
        ),
        avaliador:usuarios(nome, email)
      `)
      .eq('id', id)
      .single();

    if (error) throw error;

    if (!data) {
      return res.status(404).json({
        error: 'Avaliação não encontrada'
      });
    }

    res.json({
      success: true,
      avaliacao: data
    });

  } catch (error) {
    console.error('Erro ao buscar avaliação:', error);
    res.status(500).json({
      error: 'Erro ao buscar avaliação',
      message: error.message
    });
  }
};

// GET /api/avaliacoes-nivel/aluno/:alunoId/historico - Histórico de avaliações do aluno
export const getHistoricoAvaliacoesAluno = async (req, res) => {
  try {
    const { alunoId } = req.params;

    const { data, error } = await supabaseAdmin
      .from('avaliacoes_nivel')
      .select(`
        *,
        avaliador:usuarios(nome, email)
      `)
      .eq('aluno_id', alunoId)
      .order('data_avaliacao', { ascending: false });

    if (error) throw error;

    res.json({
      success: true,
      count: data.length,
      historico: data
    });

  } catch (error) {
    console.error('Erro ao buscar histórico:', error);
    res.status(500).json({
      error: 'Erro ao buscar histórico',
      message: error.message
    });
  }
};

// POST /api/avaliacoes-nivel - Criar nova avaliação
export const createAvaliacao = async (req, res) => {
  try {
    const {
      aluno_id,
      nivel_anterior,
      nivel_avaliado,
      nota_tecnica,
      nota_tatica,
      nota_fisico,
      nota_atitude,
      nota_frequencia,
      pontos_fortes,
      pontos_fracos,
      recomendacoes,
      observacoes,
      data_proxima_avaliacao
    } = req.body;

    // Validações
    if (!aluno_id || !nivel_anterior || !nivel_avaliado) {
      return res.status(400).json({
        error: 'Dados incompletos',
        message: 'Aluno, nível anterior e nível avaliado são obrigatórios'
      });
    }

    // Validar notas (0-10)
    const notas = [nota_tecnica, nota_tatica, nota_fisico, nota_atitude, nota_frequencia];
    for (const nota of notas) {
      if (nota !== null && nota !== undefined && (nota < 0 || nota > 10)) {
        return res.status(400).json({
          error: 'Notas inválidas',
          message: 'Notas devem estar entre 0 e 10'
        });
      }
    }

    // Calcular média
    const notasValidas = notas.filter(n => n !== null && n !== undefined);
    const media = notasValidas.length > 0
      ? notasValidas.reduce((sum, n) => sum + n, 0) / notasValidas.length
      : 0;

    // Determinar resultado (aprovado se média >= 7.0)
    const resultado = media >= 7.0 ? 'aprovado' : 'reprovado';

    const { data: avaliacao, error } = await supabaseAdmin
      .from('avaliacoes_nivel')
      .insert({
        aluno_id,
        nivel_anterior,
        nivel_avaliado,
        nota_tecnica,
        nota_tatica,
        nota_fisico,
        nota_atitude,
        nota_frequencia,
        nota_media: media,
        pontos_fortes,
        pontos_fracos,
        recomendacoes,
        observacoes,
        resultado,
        data_avaliacao: new Date().toISOString(),
        data_proxima_avaliacao,
        avaliador_id: req.user?.id
      })
      .select(`
        *,
        aluno:alunos(id, usuario:usuarios(nome)),
        avaliador:usuarios(nome)
      `)
      .single();

    if (error) throw error;

    // Se aprovado, atualizar nível do aluno
    if (resultado === 'aprovado') {
      await supabaseAdmin
        .from('alunos')
        .update({
          nivel_atual: nivel_avaliado,
          data_nivel_atual: new Date().toISOString(),
          status_avaliacao_nivel: 'aprovado',
          proxima_avaliacao_nivel: data_proxima_avaliacao
        })
        .eq('id', aluno_id);
    } else {
      await supabaseAdmin
        .from('alunos')
        .update({
          status_avaliacao_nivel: 'reprovado',
          proxima_avaliacao_nivel: data_proxima_avaliacao
        })
        .eq('id', aluno_id);
    }

    res.status(201).json({
      success: true,
      message: `Avaliação criada com sucesso. Aluno ${resultado === 'aprovado' ? 'promovido' : 'mantido'} no nível ${resultado === 'aprovado' ? nivel_avaliado : nivel_anterior}`,
      avaliacao
    });

  } catch (error) {
    console.error('Erro ao criar avaliação:', error);
    res.status(500).json({
      error: 'Erro ao criar avaliação',
      message: error.message
    });
  }
};

// PUT /api/avaliacoes-nivel/:id - Atualizar avaliação
export const updateAvaliacao = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = { ...req.body };

    // Recalcular média se notas foram atualizadas
    const notas = [
      updateData.nota_tecnica,
      updateData.nota_tatica,
      updateData.nota_fisico,
      updateData.nota_atitude,
      updateData.nota_frequencia
    ].filter(n => n !== null && n !== undefined);

    if (notas.length > 0) {
      const media = notas.reduce((sum, n) => sum + n, 0) / notas.length;
      updateData.nota_media = media;
      updateData.resultado = media >= 7.0 ? 'aprovado' : 'reprovado';
    }

    const { data, error } = await supabaseAdmin
      .from('avaliacoes_nivel')
      .update(updateData)
      .eq('id', id)
      .select(`
        *,
        aluno:alunos(id, usuario:usuarios(nome)),
        avaliador:usuarios(nome)
      `)
      .single();

    if (error) throw error;

    res.json({
      success: true,
      message: 'Avaliação atualizada com sucesso',
      avaliacao: data
    });

  } catch (error) {
    console.error('Erro ao atualizar avaliação:', error);
    res.status(500).json({
      error: 'Erro ao atualizar avaliação',
      message: error.message
    });
  }
};

// DELETE /api/avaliacoes-nivel/:id - Deletar avaliação
export const deleteAvaliacao = async (req, res) => {
  try {
    const { id } = req.params;

    // Verificar se avaliação existe
    const { data: avaliacao } = await supabaseAdmin
      .from('avaliacoes_nivel')
      .select('id')
      .eq('id', id)
      .single();

    if (!avaliacao) {
      return res.status(404).json({
        error: 'Avaliação não encontrada'
      });
    }

    const { error } = await supabaseAdmin
      .from('avaliacoes_nivel')
      .delete()
      .eq('id', id);

    if (error) throw error;

    res.json({
      success: true,
      message: 'Avaliação deletada com sucesso'
    });

  } catch (error) {
    console.error('Erro ao deletar avaliação:', error);
    res.status(500).json({
      error: 'Erro ao deletar avaliação',
      message: error.message
    });
  }
};

// GET /api/avaliacoes-nivel/alunos-pendentes - Listar alunos pendentes de avaliação
export const getAlunosPendentesAvaliacao = async (req, res) => {
  try {
    const { unidade_id } = req.query;

    let query = supabaseAdmin
      .from('alunos')
      .select(`
        id,
        usuario:usuarios(nome, email),
        nivel,
        nivel_atual,
        data_nivel_atual,
        status_avaliacao_nivel,
        proxima_avaliacao_nivel,
        unidade:unidades(nome)
      `)
      .eq('status', 'ativo');

    if (unidade_id) {
      query = query.eq('unidade_id', unidade_id);
    }

    // Filtrar alunos que precisam de avaliação
    // - Nunca foram avaliados (status_avaliacao_nivel IS NULL)
    // - Ou próxima avaliação <= hoje
    const { data, error } = await query;

    if (error) throw error;

    const hoje = new Date().toISOString().split('T')[0];

    const alunosPendentes = data.filter(aluno => {
      return !aluno.status_avaliacao_nivel ||
             (aluno.proxima_avaliacao_nivel && aluno.proxima_avaliacao_nivel <= hoje);
    });

    res.json({
      success: true,
      count: alunosPendentes.length,
      alunos: alunosPendentes
    });

  } catch (error) {
    console.error('Erro ao buscar alunos pendentes:', error);
    res.status(500).json({
      error: 'Erro ao buscar alunos pendentes',
      message: error.message
    });
  }
};
