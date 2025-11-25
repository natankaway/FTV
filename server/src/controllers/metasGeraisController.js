import { supabaseAdmin } from '../config/supabase.js';

export const listarMetasGerais = async (req, res) => {
  try {
    const { escopo, unidade_id } = req.query;

    let query = supabaseAdmin
      .from('metas_gerais')
      .select('*')
      .order('created_at', { ascending: false });

    // Filtrar por escopo se fornecido
    if (escopo) {
      query = query.eq('escopo', escopo);
    }

    // Filtrar por unidade se fornecido
    if (unidade_id) {
      query = query.eq('unidade_id', unidade_id);
    }

    const { data: metas, error } = await query;

    if (error) throw error;

    res.json({ metas });
  } catch (error) {
    console.error('Erro ao listar metas gerais:', error);
    res.status(500).json({ error: 'Erro ao listar metas gerais' });
  }
};

export const buscarMetaGeral = async (req, res) => {
  try {
    const { id } = req.params;

    const { data: meta, error } = await supabaseAdmin
      .from('metas_gerais')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;

    if (!meta) {
      return res.status(404).json({ error: 'Meta não encontrada' });
    }

    res.json({ meta });
  } catch (error) {
    console.error('Erro ao buscar meta geral:', error);
    res.status(500).json({ error: 'Erro ao buscar meta geral' });
  }
};

export const criarMetaGeral = async (req, res) => {
  try {
    const {
      titulo,
      descricao,
      escopo,
      unidade_id,
      valor_alvo,
      valor_atual,
      prazo,
      responsavel
    } = req.body;

    // Validações básicas
    if (!titulo || !escopo || !valor_alvo) {
      return res.status(400).json({
        error: 'Título, escopo e valor alvo são obrigatórios'
      });
    }

    if (escopo === 'Unidade' && !unidade_id) {
      return res.status(400).json({
        error: 'Unidade é obrigatória para metas de escopo Unidade'
      });
    }

    const metaData = {
      titulo,
      descricao: descricao || null,
      escopo,
      unidade_id: escopo === 'Unidade' ? unidade_id : null,
      valor_alvo,
      valor_atual: valor_atual || 0,
      prazo: prazo || null,
      responsavel: responsavel || null
    };

    const { data: meta, error } = await supabaseAdmin
      .from('metas_gerais')
      .insert([metaData])
      .select()
      .single();

    if (error) throw error;

    res.status(201).json({ meta });
  } catch (error) {
    console.error('Erro ao criar meta geral:', error);
    res.status(500).json({ error: 'Erro ao criar meta geral' });
  }
};

export const atualizarMetaGeral = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      titulo,
      descricao,
      escopo,
      unidade_id,
      valor_alvo,
      valor_atual,
      prazo,
      responsavel
    } = req.body;

    // Validações básicas
    if (escopo === 'Unidade' && !unidade_id) {
      return res.status(400).json({
        error: 'Unidade é obrigatória para metas de escopo Unidade'
      });
    }

    const metaData = {
      titulo,
      descricao,
      escopo,
      unidade_id: escopo === 'Unidade' ? unidade_id : null,
      valor_alvo,
      valor_atual,
      prazo,
      responsavel,
      updated_at: new Date().toISOString()
    };

    const { data: meta, error } = await supabaseAdmin
      .from('metas_gerais')
      .update(metaData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    if (!meta) {
      return res.status(404).json({ error: 'Meta não encontrada' });
    }

    res.json({ meta });
  } catch (error) {
    console.error('Erro ao atualizar meta geral:', error);
    res.status(500).json({ error: 'Erro ao atualizar meta geral' });
  }
};

export const atualizarProgressoMeta = async (req, res) => {
  try {
    const { id } = req.params;
    const { valor_atual } = req.body;

    if (valor_atual === undefined || valor_atual === null) {
      return res.status(400).json({ error: 'Valor atual é obrigatório' });
    }

    const { data: meta, error } = await supabaseAdmin
      .from('metas_gerais')
      .update({
        valor_atual,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    if (!meta) {
      return res.status(404).json({ error: 'Meta não encontrada' });
    }

    res.json({ meta });
  } catch (error) {
    console.error('Erro ao atualizar progresso da meta:', error);
    res.status(500).json({ error: 'Erro ao atualizar progresso da meta' });
  }
};

export const deletarMetaGeral = async (req, res) => {
  try {
    const { id } = req.params;

    const { error } = await supabaseAdmin
      .from('metas_gerais')
      .delete()
      .eq('id', id);

    if (error) throw error;

    res.json({ message: 'Meta geral deletada com sucesso' });
  } catch (error) {
    console.error('Erro ao deletar meta geral:', error);
    res.status(500).json({ error: 'Erro ao deletar meta geral' });
  }
};

export const obterEstatisticasMetas = async (req, res) => {
  try {
    const { escopo, unidade_id } = req.query;

    let query = supabaseAdmin
      .from('metas_gerais')
      .select('*');

    if (escopo) {
      query = query.eq('escopo', escopo);
    }

    if (unidade_id) {
      query = query.eq('unidade_id', unidade_id);
    }

    const { data: metas, error } = await query;

    if (error) throw error;

    // Calcular estatísticas
    const hoje = new Date();
    let emAndamento = 0;
    let concluidas = 0;
    let atrasadas = 0;

    metas.forEach(meta => {
      const progresso = (meta.valor_atual / meta.valor_alvo) * 100;
      const prazo = meta.prazo ? new Date(meta.prazo) : null;

      if (progresso >= 100) {
        concluidas++;
      } else if (prazo && hoje > prazo) {
        atrasadas++;
      } else {
        emAndamento++;
      }
    });

    const progressoMedio = metas.length > 0
      ? metas.reduce((sum, meta) => sum + (meta.valor_atual / meta.valor_alvo) * 100, 0) / metas.length
      : 0;

    res.json({
      total: metas.length,
      emAndamento,
      concluidas,
      atrasadas,
      progressoMedio: Math.round(progressoMedio)
    });
  } catch (error) {
    console.error('Erro ao obter estatísticas das metas:', error);
    res.status(500).json({ error: 'Erro ao obter estatísticas' });
  }
};
