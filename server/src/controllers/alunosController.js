import { supabaseAdmin } from '../config/supabase.js';

// Listar todos os alunos
export const getAlunos = async (req, res) => {
  try {
    const { unidade_id, status, nivel } = req.query;

    let query = supabaseAdmin
      .from('alunos')
      .select(`
        *,
        usuario:usuarios(nome, email, telefone, ativo),
        unidade:unidades(nome),
        plano:planos(nome, preco)
      `)
      .order('created_at', { ascending: false });

    // Filtros
    if (unidade_id) {
      query = query.eq('unidade_id', unidade_id);
    }

    if (status) {
      query = query.eq('status', status);
    }

    if (nivel) {
      query = query.eq('nivel', nivel);
    }

    // Se não for admin, filtrar por unidade do usuário
    if (req.user && req.user.perfil !== 'admin') {
      // Gestores veem apenas suas unidades
      if (req.user.perfil === 'gestor') {
        // Buscar unidades do gestor
        const { data: gestorData } = await supabaseAdmin
          .from('gestores')
          .select('gestor_unidades(unidade_id)')
          .eq('usuario_id', req.user.id)
          .single();

        const unidadeIds = gestorData?.gestor_unidades?.map(u => u.unidade_id) || [];
        query = query.in('unidade_id', unidadeIds);
      }
    }

    const { data, error } = await query;

    if (error) throw error;

    // Transformar dados para achatar a estrutura do usuario
    const alunosTransformados = data.map(aluno => ({
      ...aluno,
      nome: aluno.usuario?.nome || '',
      email: aluno.usuario?.email || '',
      telefone: aluno.usuario?.telefone || '',
      ativo: aluno.usuario?.ativo ?? true,
      unidade: aluno.unidade?.nome || '',
      plano_nome: aluno.plano?.nome || '',
      plano_preco: aluno.plano?.preco || 0
    }));

    res.json({
      success: true,
      count: alunosTransformados.length,
      alunos: alunosTransformados
    });

  } catch (error) {
    console.error('Erro ao buscar alunos:', error);
    res.status(500).json({
      error: 'Erro ao buscar alunos',
      message: error.message
    });
  }
};

// Buscar aluno por ID
export const getAlunoById = async (req, res) => {
  try {
    const { id } = req.params;

    const { data, error } = await supabaseAdmin
      .from('alunos')
      .select(`
        *,
        usuario:usuarios(*),
        unidade:unidades(*),
        plano:planos(*)
      `)
      .eq('id', id)
      .single();

    if (error) throw error;

    if (!data) {
      return res.status(404).json({
        error: 'Aluno não encontrado',
        message: 'Nenhum aluno encontrado com este ID'
      });
    }

    res.json({
      success: true,
      aluno: data
    });

  } catch (error) {
    console.error('Erro ao buscar aluno:', error);
    res.status(500).json({
      error: 'Erro ao buscar aluno',
      message: error.message
    });
  }
};

// Criar novo aluno
export const createAluno = async (req, res) => {
  try {
    const {
      // Dados do usuário
      nome,
      email,
      telefone,
      senha,
      // Dados do aluno
      tipo_plano,
      plano_id,
      plataforma_parceira,
      unidade_id,
      vencimento,
      nivel,
      objetivo
    } = req.body;

    // Validações
    if (!nome || !email || !tipo_plano || !unidade_id) {
      return res.status(400).json({
        error: 'Dados incompletos',
        message: 'Nome, email, tipo de plano e unidade são obrigatórios'
      });
    }

    // Criar usuário primeiro
    const bcrypt = (await import('bcryptjs')).default;
    const senhaHash = await bcrypt.hash(senha || '123456', 12);

    const { data: usuario, error: usuarioError } = await supabaseAdmin
      .from('usuarios')
      .insert({
        nome,
        email,
        telefone,
        senha: senhaHash,
        perfil: 'aluno',
        ativo: true
      })
      .select()
      .single();

    if (usuarioError) throw usuarioError;

    // Criar aluno
    const { data: aluno, error: alunoError } = await supabaseAdmin
      .from('alunos')
      .insert({
        usuario_id: usuario.id,
        tipo_plano,
        plano_id,
        plataforma_parceira,
        unidade_id,
        vencimento,
        nivel: nivel || 'iniciante',
        data_matricula: new Date().toISOString().split('T')[0],
        objetivo,
        status: 'ativo'
      })
      .select(`
        *,
        usuario:usuarios(*),
        unidade:unidades(nome)
      `)
      .single();

    if (alunoError) throw alunoError;

    res.status(201).json({
      success: true,
      message: 'Aluno criado com sucesso',
      aluno
    });

  } catch (error) {
    console.error('Erro ao criar aluno:', error);
    res.status(500).json({
      error: 'Erro ao criar aluno',
      message: error.message
    });
  }
};

// Atualizar aluno
export const updateAluno = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    // Separar dados do usuário dos dados do aluno
    const { nome, email, telefone, ativo, ...dadosAluno } = updateData;

    // Se houver dados do usuário para atualizar
    if (nome || email || telefone || ativo !== undefined) {
      // Buscar usuario_id
      const { data: alunoAtual } = await supabaseAdmin
        .from('alunos')
        .select('usuario_id')
        .eq('id', id)
        .single();

      if (alunoAtual?.usuario_id) {
        await supabaseAdmin
          .from('usuarios')
          .update({ nome, email, telefone, ativo })
          .eq('id', alunoAtual.usuario_id);
      }
    }

    // Atualizar dados do aluno
    const { data, error } = await supabaseAdmin
      .from('alunos')
      .update(dadosAluno)
      .eq('id', id)
      .select(`
        *,
        usuario:usuarios(*),
        unidade:unidades(nome)
      `)
      .single();

    if (error) throw error;

    res.json({
      success: true,
      message: 'Aluno atualizado com sucesso',
      aluno: data
    });

  } catch (error) {
    console.error('Erro ao atualizar aluno:', error);
    res.status(500).json({
      error: 'Erro ao atualizar aluno',
      message: error.message
    });
  }
};

// Deletar aluno
export const deleteAluno = async (req, res) => {
  try {
    const { id } = req.params;

    // Buscar usuario_id antes de deletar
    const { data: aluno } = await supabaseAdmin
      .from('alunos')
      .select('usuario_id')
      .eq('id', id)
      .single();

    if (!aluno) {
      return res.status(404).json({
        error: 'Aluno não encontrado',
        message: 'Nenhum aluno encontrado com este ID'
      });
    }

    // Deletar aluno (cascade vai deletar as referências)
    const { error: alunoError } = await supabaseAdmin
      .from('alunos')
      .delete()
      .eq('id', id);

    if (alunoError) throw alunoError;

    // Deletar usuário
    const { error: usuarioError } = await supabaseAdmin
      .from('usuarios')
      .delete()
      .eq('id', aluno.usuario_id);

    if (usuarioError) throw usuarioError;

    res.json({
      success: true,
      message: 'Aluno deletado com sucesso'
    });

  } catch (error) {
    console.error('Erro ao deletar aluno:', error);
    res.status(500).json({
      error: 'Erro ao deletar aluno',
      message: error.message
    });
  }
};

// Estatísticas do aluno
export const getAlunoStats = async (req, res) => {
  try {
    const { id } = req.params;

    // Buscar presenças
    const { data: presencas } = await supabaseAdmin
      .from('presencas')
      .select('*')
      .eq('aluno_id', id);

    // Buscar conquistas
    const { data: conquistas } = await supabaseAdmin
      .from('conquistas')
      .select('*')
      .eq('aluno_id', id);

    // Buscar objetivos
    const { data: objetivos } = await supabaseAdmin
      .from('objetivos_pessoais')
      .select('*')
      .eq('aluno_id', id);

    // Calcular estatísticas
    const hoje = new Date();
    const umMesAtras = new Date();
    umMesAtras.setMonth(hoje.getMonth() - 1);

    const presencasMes = presencas?.filter(p =>
      new Date(p.data) >= umMesAtras
    ).length || 0;

    const stats = {
      totalPresencas: presencas?.length || 0,
      presencasMes,
      totalConquistas: conquistas?.length || 0,
      conquistasDesbloqueadas: conquistas?.filter(c => c.desbloqueada_em).length || 0,
      objetivosAtivos: objetivos?.filter(o => o.status === 'ativo').length || 0,
      objetivosConcluidos: objetivos?.filter(o => o.status === 'concluido').length || 0
    };

    res.json({
      success: true,
      stats
    });

  } catch (error) {
    console.error('Erro ao buscar estatísticas:', error);
    res.status(500).json({
      error: 'Erro ao buscar estatísticas',
      message: error.message
    });
  }
};
