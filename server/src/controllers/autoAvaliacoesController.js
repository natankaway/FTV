import { supabaseAdmin } from '../config/supabase.js';

// GET /api/auto-avaliacoes - Listar todas as auto-avaliações
export const getAutoAvaliacoes = async (req, res) => {
  try {
    const { aluno_id, data_inicio, data_fim, min_nota } = req.query;

    let query = supabaseAdmin
      .from('auto_avaliacoes')
      .select(`
        *,
        aluno:alunos(
          id,
          usuario:usuarios(nome, email)
        )
      `)
      .order('data_treino', { ascending: false });

    // Filtros
    if (aluno_id) {
      query = query.eq('aluno_id', aluno_id);
    }

    if (data_inicio) {
      query = query.gte('data_treino', data_inicio);
    }

    if (data_fim) {
      query = query.lte('data_treino', data_fim);
    }

    if (min_nota) {
      query = query.gte('nota_treino', parseFloat(min_nota));
    }

    const { data, error } = await query;

    if (error) throw error;

    res.json({
      success: true,
      count: data.length,
      avaliacoes: data
    });

  } catch (error) {
    console.error('Erro ao buscar auto-avaliações:', error);
    res.status(500).json({
      error: 'Erro ao buscar auto-avaliações',
      message: error.message
    });
  }
};

// GET /api/auto-avaliacoes/:id - Buscar auto-avaliação por ID
export const getAutoAvaliacaoById = async (req, res) => {
  try {
    const { id } = req.params;

    const { data, error } = await supabaseAdmin
      .from('auto_avaliacoes')
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
        error: 'Auto-avaliação não encontrada'
      });
    }

    res.json({
      success: true,
      avaliacao: data
    });

  } catch (error) {
    console.error('Erro ao buscar auto-avaliação:', error);
    res.status(500).json({
      error: 'Erro ao buscar auto-avaliação',
      message: error.message
    });
  }
};

// GET /api/auto-avaliacoes/aluno/:alunoId - Listar auto-avaliações de um aluno
export const getAutoAvaliacoesAluno = async (req, res) => {
  try {
    const { alunoId } = req.params;
    const { limit } = req.query;

    let query = supabaseAdmin
      .from('auto_avaliacoes')
      .select('*')
      .eq('aluno_id', alunoId)
      .order('data_treino', { ascending: false });

    if (limit) {
      query = query.limit(parseInt(limit));
    }

    const { data, error } = await query;

    if (error) throw error;

    // Calcular estatísticas
    if (data.length > 0) {
      const notaMedia = data.reduce((sum, a) => sum + a.nota_treino, 0) / data.length;

      // Pontos fracos mais mencionados
      const pontosFracosCount = {};
      data.forEach(av => {
        if (av.pontos_fracos && Array.isArray(av.pontos_fracos)) {
          av.pontos_fracos.forEach(pf => {
            pontosFracosCount[pf] = (pontosFracosCount[pf] || 0) + 1;
          });
        }
      });

      const pontosFracosFrequentes = Object.entries(pontosFracosCount)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 5)
        .map(([ponto, count]) => ({ ponto, count }));

      // Pontos fortes mais mencionados
      const pontosFortesCount = {};
      data.forEach(av => {
        if (av.pontos_fortes && Array.isArray(av.pontos_fortes)) {
          av.pontos_fortes.forEach(pf => {
            pontosFortesCount[pf] = (pontosFortesCount[pf] || 0) + 1;
          });
        }
      });

      const pontosFortesFrequentes = Object.entries(pontosFortesCount)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 5)
        .map(([ponto, count]) => ({ ponto, count }));

      res.json({
        success: true,
        total: data.length,
        estatisticas: {
          nota_media: notaMedia.toFixed(2),
          pontos_fracos_frequentes: pontosFracosFrequentes,
          pontos_fortes_frequentes: pontosFortesFrequentes
        },
        avaliacoes: data
      });
    } else {
      res.json({
        success: true,
        total: 0,
        estatisticas: null,
        avaliacoes: []
      });
    }

  } catch (error) {
    console.error('Erro ao buscar auto-avaliações do aluno:', error);
    res.status(500).json({
      error: 'Erro ao buscar auto-avaliações do aluno',
      message: error.message
    });
  }
};

// POST /api/auto-avaliacoes - Criar nova auto-avaliação
export const createAutoAvaliacao = async (req, res) => {
  try {
    const {
      aluno_id,
      data_treino,
      nota_treino,
      pontos_fracos,
      pontos_fortes,
      foco_proximo_treino
    } = req.body;

    // Validações
    if (!aluno_id || !data_treino || !nota_treino) {
      return res.status(400).json({
        error: 'Dados incompletos',
        message: 'Aluno, data do treino e nota são obrigatórios'
      });
    }

    if (nota_treino < 1 || nota_treino > 5) {
      return res.status(400).json({
        error: 'Nota inválida',
        message: 'Nota deve estar entre 1 e 5'
      });
    }

    const { data, error } = await supabaseAdmin
      .from('auto_avaliacoes')
      .insert({
        aluno_id,
        data_treino,
        nota_treino,
        pontos_fracos: pontos_fracos || [],
        pontos_fortes: pontos_fortes || [],
        foco_proximo_treino
      })
      .select(`
        *,
        aluno:alunos(id, usuario:usuarios(nome))
      `)
      .single();

    if (error) throw error;

    res.status(201).json({
      success: true,
      message: 'Auto-avaliação registrada com sucesso',
      avaliacao: data
    });

  } catch (error) {
    console.error('Erro ao criar auto-avaliação:', error);
    res.status(500).json({
      error: 'Erro ao criar auto-avaliação',
      message: error.message
    });
  }
};

// PUT /api/auto-avaliacoes/:id - Atualizar auto-avaliação
export const updateAutoAvaliacao = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    // Validar nota se foi enviada
    if (updateData.nota_treino && (updateData.nota_treino < 1 || updateData.nota_treino > 5)) {
      return res.status(400).json({
        error: 'Nota inválida',
        message: 'Nota deve estar entre 1 e 5'
      });
    }

    const { data, error } = await supabaseAdmin
      .from('auto_avaliacoes')
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
      message: 'Auto-avaliação atualizada com sucesso',
      avaliacao: data
    });

  } catch (error) {
    console.error('Erro ao atualizar auto-avaliação:', error);
    res.status(500).json({
      error: 'Erro ao atualizar auto-avaliação',
      message: error.message
    });
  }
};

// DELETE /api/auto-avaliacoes/:id - Deletar auto-avaliação
export const deleteAutoAvaliacao = async (req, res) => {
  try {
    const { id } = req.params;

    const { error } = await supabaseAdmin
      .from('auto_avaliacoes')
      .delete()
      .eq('id', id);

    if (error) throw error;

    res.json({
      success: true,
      message: 'Auto-avaliação deletada com sucesso'
    });

  } catch (error) {
    console.error('Erro ao deletar auto-avaliação:', error);
    res.status(500).json({
      error: 'Erro ao deletar auto-avaliação',
      message: error.message
    });
  }
};

// GET /api/auto-avaliacoes/aluno/:alunoId/evolucao - Evolução das notas ao longo do tempo
export const getEvolucaoNotas = async (req, res) => {
  try {
    const { alunoId } = req.params;
    const { meses = 6 } = req.query;

    // Buscar avaliações dos últimos N meses
    const dataInicio = new Date();
    dataInicio.setMonth(dataInicio.getMonth() - parseInt(meses));

    const { data, error } = await supabaseAdmin
      .from('auto_avaliacoes')
      .select('data_treino, nota_treino')
      .eq('aluno_id', alunoId)
      .gte('data_treino', dataInicio.toISOString().split('T')[0])
      .order('data_treino', { ascending: true });

    if (error) throw error;

    // Agrupar por mês
    const notasPorMes = {};

    data.forEach(av => {
      const mes = av.data_treino.substring(0, 7); // YYYY-MM
      if (!notasPorMes[mes]) {
        notasPorMes[mes] = {
          mes,
          notas: [],
          media: 0
        };
      }
      notasPorMes[mes].notas.push(av.nota_treino);
    });

    // Calcular médias
    Object.values(notasPorMes).forEach(mesData => {
      mesData.media = mesData.notas.reduce((sum, n) => sum + n, 0) / mesData.notas.length;
      mesData.total_avaliacoes = mesData.notas.length;
      delete mesData.notas; // Remover array de notas da resposta
    });

    const evolucao = Object.values(notasPorMes);

    res.json({
      success: true,
      periodo_meses: parseInt(meses),
      evolucao
    });

  } catch (error) {
    console.error('Erro ao buscar evolução:', error);
    res.status(500).json({
      error: 'Erro ao buscar evolução',
      message: error.message
    });
  }
};
