import { supabaseAdmin } from '../config/supabase.js';

export const getConfig = async (req, res) => {
  try {
    const { data: config, error } = await supabaseAdmin
      .from('config_ct')
      .select('*')
      .single();
    if (error && error.code !== 'PGRST116') throw error;
    res.json({ config: config || {} });
  } catch (error) {
    console.error('Erro ao buscar config:', error);
    res.status(500).json({ error: 'Erro ao buscar configuração' });
  }
};

export const updateConfig = async (req, res) => {
  try {
    const { data: existing } = await supabaseAdmin.from('config_ct').select('id').single();

    let config;
    if (existing) {
      const { data, error } = await supabaseAdmin
        .from('config_ct')
        .update(req.body)
        .eq('id', existing.id)
        .select()
        .single();
      if (error) throw error;
      config = data;
    } else {
      const { data, error } = await supabaseAdmin
        .from('config_ct')
        .insert([req.body])
        .select()
        .single();
      if (error) throw error;
      config = data;
    }
    res.json({ config });
  } catch (error) {
    console.error('Erro ao atualizar config:', error);
    res.status(500).json({ error: 'Erro ao atualizar configuração' });
  }
};
