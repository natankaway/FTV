import { supabaseAdmin } from '../config/supabase.js';

// GET /api/registros-horas-professores - Listar todos os registros
export const getRegistrosHoras = async (req, res) => {
  try {
    const { professor_id, unidade_id, data_inicio, data_fim, tipo_atividade } = req.query;

    let query = supabaseAdmin
      .from('registros_horas_professores')
      .select(`
        *,
        professor:professores(
          id,
          usuario:usuarios(nome, email)
        ),
        unidade:unidades(id, nome),
        registrado_por_user:usuarios!registros_horas_professores_registrado_por_fkey(nome),
        editado_por_user:usuarios!registros_horas_professores_editado_por_fkey(nome)
      `)
      .order('data', { ascending: false });

    // Filtros
    if (professor_id) {
      query = query.eq('professor_id', professor_id);
    }

    if (unidade_id) {
      query = query.eq('unidade_id', unidade_id);
    }

    if (data_inicio) {
      query = query.gte('data', data_inicio);
    }

    if (data_fim) {
      query = query.lte('data', data_fim);
    }

    if (tipo_atividade) {
      query = query.eq('tipo_atividade', tipo_atividade);
    }

    // Filtro por permissão
    if (req.user && req.user.perfil === 'professor') {
      // Professor só vê seus próprios registros
      query = query.eq('professor_id', req.user.id);
    } else if (req.user && req.user.perfil === 'gestor') {
      // Gestor vê apenas de suas unidades
      const { data: gestorData } = await supabaseAdmin
        .from('gestores')
        .select('gestor_unidades(unidade_id)')
        .eq('usuario_id', req.user.id)
        .single();

      const unidadeIds = gestorData?.gestor_unidades?.map(u => u.unidade_id) || [];
      query = query.in('unidade_id', unidadeIds);
    }

    const { data, error } = await query;

    if (error) throw error;

    res.json({
      success: true,
      count: data.length,
      registros: data
    });

  } catch (error) {
    console.error('Erro ao buscar registros de horas:', error);
    res.status(500).json({
      error: 'Erro ao buscar registros de horas',
      message: error.message
    });
  }
};

// GET /api/registros-horas-professores/:id - Buscar registro por ID
export const getRegistroHoraById = async (req, res) => {
  try {
    const { id } = req.params;

    const { data, error } = await supabaseAdmin
      .from('registros_horas_professores')
      .select(`
        *,
        professor:professores(
          id,
          usuario:usuarios(nome, email, telefone),
          tipo_pagamento,
          valor_hora,
          valores_horas_variaveis,
          valor_aulao
        ),
        unidade:unidades(*),
        registrado_por_user:usuarios!registros_horas_professores_registrado_por_fkey(nome),
        editado_por_user:usuarios!registros_horas_professores_editado_por_fkey(nome)
      `)
      .eq('id', id)
      .single();

    if (error) throw error;

    if (!data) {
      return res.status(404).json({
        error: 'Registro não encontrado'
      });
    }

    res.json({
      success: true,
      registro: data
    });

  } catch (error) {
    console.error('Erro ao buscar registro:', error);
    res.status(500).json({
      error: 'Erro ao buscar registro',
      message: error.message
    });
  }
};

// POST /api/registros-horas-professores - Criar novo registro
export const createRegistroHora = async (req, res) => {
  try {
    const {
      professor_id,
      unidade_id,
      data: dataRegistro,
      horas_trabalhadas,
      tipo_atividade,
      observacoes
    } = req.body;

    // Validações
    if (!professor_id || !unidade_id || !dataRegistro || !horas_trabalhadas || !tipo_atividade) {
      return res.status(400).json({
        error: 'Dados incompletos',
        message: 'Professor, unidade, data, horas trabalhadas e tipo de atividade são obrigatórios'
      });
    }

    if (horas_trabalhadas <= 0) {
      return res.status(400).json({
        error: 'Horas inválidas',
        message: 'Horas trabalhadas deve ser maior que zero'
      });
    }

    const { data, error } = await supabaseAdmin
      .from('registros_horas_professores')
      .insert({
        professor_id,
        unidade_id,
        data: dataRegistro,
        horas_trabalhadas,
        tipo_atividade,
        observacoes,
        registrado_por: req.user?.id,
        registrado_em: new Date().toISOString()
      })
      .select(`
        *,
        professor:professores(id, usuario:usuarios(nome)),
        unidade:unidades(nome)
      `)
      .single();

    if (error) throw error;

    res.status(201).json({
      success: true,
      message: 'Registro de horas criado com sucesso',
      registro: data
    });

  } catch (error) {
    console.error('Erro ao criar registro de horas:', error);
    res.status(500).json({
      error: 'Erro ao criar registro de horas',
      message: error.message
    });
  }
};

// PUT /api/registros-horas-professores/:id - Atualizar registro
export const updateRegistroHora = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = { ...req.body };

    // Adicionar informações de edição
    updateData.editado_por = req.user?.id;
    updateData.editado_em = new Date().toISOString();

    const { data, error } = await supabaseAdmin
      .from('registros_horas_professores')
      .update(updateData)
      .eq('id', id)
      .select(`
        *,
        professor:professores(id, usuario:usuarios(nome)),
        unidade:unidades(nome)
      `)
      .single();

    if (error) throw error;

    res.json({
      success: true,
      message: 'Registro atualizado com sucesso',
      registro: data
    });

  } catch (error) {
    console.error('Erro ao atualizar registro:', error);
    res.status(500).json({
      error: 'Erro ao atualizar registro',
      message: error.message
    });
  }
};

// DELETE /api/registros-horas-professores/:id - Deletar registro
export const deleteRegistroHora = async (req, res) => {
  try {
    const { id } = req.params;

    // Verificar se registro existe
    const { data: registro } = await supabaseAdmin
      .from('registros_horas_professores')
      .select('id')
      .eq('id', id)
      .single();

    if (!registro) {
      return res.status(404).json({
        error: 'Registro não encontrado'
      });
    }

    const { error } = await supabaseAdmin
      .from('registros_horas_professores')
      .delete()
      .eq('id', id);

    if (error) throw error;

    res.json({
      success: true,
      message: 'Registro deletado com sucesso'
    });

  } catch (error) {
    console.error('Erro ao deletar registro:', error);
    res.status(500).json({
      error: 'Erro ao deletar registro',
      message: error.message
    });
  }
};

// GET /api/registros-horas-professores/relatorio - Relatório de horas por período
export const getRelatorioHoras = async (req, res) => {
  try {
    const { professor_id, unidade_id, mes, ano } = req.query;

    let query = supabaseAdmin
      .from('registros_horas_professores')
      .select(`
        *,
        professor:professores(
          id,
          usuario:usuarios(nome),
          tipo_pagamento,
          valor_hora,
          valores_horas_variaveis,
          valor_aulao
        ),
        unidade:unidades(nome)
      `);

    // Filtros
    if (professor_id) {
      query = query.eq('professor_id', professor_id);
    }

    if (unidade_id) {
      query = query.eq('unidade_id', unidade_id);
    }

    // Filtro por mês/ano
    if (mes && ano) {
      const dataInicio = `${ano}-${String(mes).padStart(2, '0')}-01`;
      const ultimoDia = new Date(ano, mes, 0).getDate();
      const dataFim = `${ano}-${String(mes).padStart(2, '0')}-${ultimoDia}`;

      query = query.gte('data', dataInicio).lte('data', dataFim);
    }

    const { data: registros, error } = await query;

    if (error) throw error;

    // Calcular totais por professor
    const resumo = {};

    registros.forEach(reg => {
      const profId = reg.professor_id;

      if (!resumo[profId]) {
        resumo[profId] = {
          professor_id: profId,
          professor_nome: reg.professor?.usuario?.nome || 'N/A',
          tipo_pagamento: reg.professor?.tipo_pagamento,
          total_horas: 0,
          horas_por_tipo: {
            'aula-regular': 0,
            'aulao': 0,
            'administrativo': 0,
            'substituicao': 0
          },
          valor_estimado: 0,
          registros: []
        };
      }

      resumo[profId].total_horas += reg.horas_trabalhadas;
      resumo[profId].horas_por_tipo[reg.tipo_atividade] =
        (resumo[profId].horas_por_tipo[reg.tipo_atividade] || 0) + reg.horas_trabalhadas;
      resumo[profId].registros.push(reg);

      // Calcular valor estimado baseado no tipo de pagamento
      const professor = reg.professor;
      if (professor) {
        if (professor.tipo_pagamento === 'fixo') {
          // Não calcula por hora
          resumo[profId].valor_estimado = 'Salário fixo';
        } else if (professor.tipo_pagamento === 'hora-fixa') {
          if (reg.tipo_atividade === 'aulao') {
            resumo[profId].valor_estimado += (professor.valor_aulao || 0) * reg.horas_trabalhadas;
          } else {
            resumo[profId].valor_estimado += (professor.valor_hora || 0) * reg.horas_trabalhadas;
          }
        } else if (professor.tipo_pagamento === 'horas-variaveis') {
          // Simplificado - assumindo valor_hora como base
          resumo[profId].valor_estimado += (professor.valor_hora || 0) * reg.horas_trabalhadas;
        }
      }
    });

    res.json({
      success: true,
      periodo: mes && ano ? { mes, ano } : 'todos',
      total_professores: Object.keys(resumo).length,
      professores: Object.values(resumo)
    });

  } catch (error) {
    console.error('Erro ao gerar relatório:', error);
    res.status(500).json({
      error: 'Erro ao gerar relatório',
      message: error.message
    });
  }
};
