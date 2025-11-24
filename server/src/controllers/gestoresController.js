import { supabaseAdmin } from '../config/supabase.js';

export const listarGestores = async (req, res) => {
  try {
    // Primeiro buscar gestores
    const { data: gestores, error } = await supabaseAdmin
      .from('gestores')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    // Buscar dados dos usuários e unidades para cada gestor
    const gestoresComDados = await Promise.all(
      gestores.map(async (gestor) => {
        let nome = '', email = '', telefone = '', ativo = true;
        let unidades = [];

        // Buscar dados do usuário
        if (gestor.usuario_id) {
          const { data: usuario } = await supabaseAdmin
            .from('usuarios')
            .select('nome, email, telefone, ativo')
            .eq('id', gestor.usuario_id)
            .single();

          if (usuario) {
            nome = usuario.nome || '';
            email = usuario.email || '';
            telefone = usuario.telefone || '';
            ativo = usuario.ativo ?? true;
          }
        }

        // Buscar unidades do gestor
        const { data: gestorUnidades } = await supabaseAdmin
          .from('gestor_unidades')
          .select('unidade_id')
          .eq('gestor_id', gestor.id);

        if (gestorUnidades && gestorUnidades.length > 0) {
          const unidadeIds = gestorUnidades.map(gu => gu.unidade_id);
          const { data: unidadesData } = await supabaseAdmin
            .from('unidades')
            .select('nome')
            .in('id', unidadeIds);

          unidades = unidadesData?.map(u => u.nome) || [];
        }

        return {
          ...gestor,
          nome,
          email,
          telefone,
          ativo,
          unidades
        };
      })
    );

    res.json({ gestores: gestoresComDados });
  } catch (error) {
    console.error('Erro ao listar gestores:', error);
    res.status(500).json({ error: 'Erro ao listar gestores' });
  }
};

export const buscarGestor = async (req, res) => {
  try {
    const { id } = req.params;
    const { data: gestor, error } = await supabaseAdmin
      .from('gestores')
      .select('*')
      .eq('id', id)
      .single();
    if (error) throw error;
    res.json({ gestor });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar gestor' });
  }
};

export const criarGestor = async (req, res) => {
  try {
    const { data: gestor, error } = await supabaseAdmin
      .from('gestores')
      .insert([req.body])
      .select()
      .single();
    if (error) throw error;
    res.status(201).json({ gestor });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao criar gestor' });
  }
};

export const atualizarGestor = async (req, res) => {
  try {
    const { id } = req.params;
    const { data: gestor, error } = await supabaseAdmin
      .from('gestores')
      .update(req.body)
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    res.json({ gestor });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao atualizar gestor' });
  }
};

export const deletarGestor = async (req, res) => {
  try {
    const { id } = req.params;
    const { error } = await supabaseAdmin.from('gestores').delete().eq('id', id);
    if (error) throw error;
    res.json({ message: 'Gestor deletado' });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao deletar gestor' });
  }
};
