import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { supabaseAdmin } from '../config/supabase.js';

// Gerar tokens JWT
const generateTokens = (userId) => {
  const accessToken = jwt.sign(
    { userId },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '15m' }
  );

  const refreshToken = jwt.sign(
    { userId },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d' }
  );

  return { accessToken, refreshToken };
};

// Calcular data de expiração do refresh token
const getRefreshTokenExpiry = () => {
  const days = parseInt(process.env.JWT_REFRESH_EXPIRES_IN?.replace('d', '')) || 7;
  const expiryDate = new Date();
  expiryDate.setDate(expiryDate.getDate() + days);
  return expiryDate.toISOString();
};

// Login
export const login = async (req, res) => {
  try {
    const { email, senha } = req.body;

    if (!email || !senha) {
      return res.status(400).json({
        error: 'Dados incompletos',
        message: 'Email e senha são obrigatórios'
      });
    }

    // Buscar usuário por email
    const { data: usuario, error } = await supabaseAdmin
      .from('usuarios')
      .select('*')
      .eq('email', email)
      .eq('ativo', true)
      .single();

    if (error || !usuario) {
      return res.status(401).json({
        error: 'Credenciais inválidas',
        message: 'Email ou senha incorretos'
      });
    }

    // Verificar senha (assumindo que temos o hash salvo)
    // NOTA: No sistema atual os dados são mockados, então vamos criar um hash padrão
    const senhaHash = usuario.senha || await bcrypt.hash('123456', parseInt(process.env.BCRYPT_ROUNDS) || 12);
    const senhaValida = await bcrypt.compare(senha, senhaHash);

    if (!senhaValida) {
      return res.status(401).json({
        error: 'Credenciais inválidas',
        message: 'Email ou senha incorretos'
      });
    }

    // Gerar tokens
    const { accessToken, refreshToken } = generateTokens(usuario.id);

    // Salvar refresh token no banco
    await supabaseAdmin
      .from('refresh_tokens')
      .insert({
        usuario_id: usuario.id,
        token: refreshToken,
        expires_at: getRefreshTokenExpiry()
      });

    // Buscar dados adicionais baseado no perfil
    let dadosAdicionais = null;

    if (usuario.perfil === 'aluno') {
      const { data } = await supabaseAdmin
        .from('alunos')
        .select('*')
        .eq('usuario_id', usuario.id)
        .single();
      dadosAdicionais = data;
    } else if (usuario.perfil === 'professor') {
      const { data } = await supabaseAdmin
        .from('professores')
        .select('*')
        .eq('usuario_id', usuario.id)
        .single();
      dadosAdicionais = data;
    } else if (usuario.perfil === 'gestor') {
      const { data } = await supabaseAdmin
        .from('gestores')
        .select('*, gestor_unidades(unidade_id)')
        .eq('usuario_id', usuario.id)
        .single();
      dadosAdicionais = data;
    }

    // Remover senha do objeto de resposta
    const { senha: _, auth_user_id, ...usuarioSemSenha } = usuario;

    res.json({
      message: 'Login realizado com sucesso',
      accessToken,
      refreshToken,
      usuario: usuarioSemSenha,
      dadosAdicionais
    });

  } catch (error) {
    console.error('Erro no login:', error);
    res.status(500).json({
      error: 'Erro ao fazer login',
      message: error.message
    });
  }
};

// Refresh token
export const refreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json({
        error: 'Token não fornecido',
        message: 'Refresh token é obrigatório'
      });
    }

    // Verificar se o refresh token existe e é válido
    const { data: tokenData, error: tokenError } = await supabaseAdmin
      .from('refresh_tokens')
      .select('*')
      .eq('token', refreshToken)
      .eq('revoked', false)
      .single();

    if (tokenError || !tokenData) {
      return res.status(403).json({
        error: 'Token inválido',
        message: 'Refresh token não encontrado ou revogado'
      });
    }

    // Verificar se o token expirou
    if (new Date(tokenData.expires_at) < new Date()) {
      return res.status(403).json({
        error: 'Token expirado',
        message: 'Refresh token expirado, faça login novamente'
      });
    }

    // Verificar assinatura do refresh token
    let decoded;
    try {
      decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    } catch (error) {
      return res.status(403).json({
        error: 'Token inválido',
        message: 'Refresh token corrompido'
      });
    }

    // Gerar novos tokens
    const { accessToken, refreshToken: newRefreshToken } = generateTokens(decoded.userId);

    // Revogar o refresh token antigo
    await supabaseAdmin
      .from('refresh_tokens')
      .update({ revoked: true, revoked_at: new Date().toISOString() })
      .eq('id', tokenData.id);

    // Salvar novo refresh token
    await supabaseAdmin
      .from('refresh_tokens')
      .insert({
        usuario_id: decoded.userId,
        token: newRefreshToken,
        expires_at: getRefreshTokenExpiry()
      });

    res.json({
      message: 'Tokens renovados com sucesso',
      accessToken,
      refreshToken: newRefreshToken
    });

  } catch (error) {
    console.error('Erro ao renovar token:', error);
    res.status(500).json({
      error: 'Erro ao renovar token',
      message: error.message
    });
  }
};

// Logout
export const logout = async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (refreshToken) {
      // Revogar refresh token
      await supabaseAdmin
        .from('refresh_tokens')
        .update({ revoked: true, revoked_at: new Date().toISOString() })
        .eq('token', refreshToken);
    }

    res.json({
      message: 'Logout realizado com sucesso'
    });

  } catch (error) {
    console.error('Erro no logout:', error);
    res.status(500).json({
      error: 'Erro ao fazer logout',
      message: error.message
    });
  }
};

// Verificar token (útil para validar sessão)
export const verifyToken = async (req, res) => {
  // Se chegou aqui, o token é válido (passou pelo middleware)
  res.json({
    valid: true,
    usuario: req.user
  });
};

// Registrar novo usuário (apenas admin pode criar)
export const register = async (req, res) => {
  try {
    const { nome, email, telefone, senha, perfil } = req.body;

    // Validações básicas
    if (!nome || !email || !senha || !perfil) {
      return res.status(400).json({
        error: 'Dados incompletos',
        message: 'Nome, email, senha e perfil são obrigatórios'
      });
    }

    // Verificar se email já existe
    const { data: existente } = await supabaseAdmin
      .from('usuarios')
      .select('id')
      .eq('email', email)
      .single();

    if (existente) {
      return res.status(409).json({
        error: 'Email já cadastrado',
        message: 'Este email já está em uso'
      });
    }

    // Hash da senha
    const senhaHash = await bcrypt.hash(senha, parseInt(process.env.BCRYPT_ROUNDS) || 12);

    // Criar usuário
    const { data: novoUsuario, error } = await supabaseAdmin
      .from('usuarios')
      .insert({
        nome,
        email,
        telefone,
        senha: senhaHash,
        perfil,
        ativo: true
      })
      .select()
      .single();

    if (error) {
      throw error;
    }

    // Remover senha da resposta
    const { senha: _, ...usuarioSemSenha } = novoUsuario;

    res.status(201).json({
      message: 'Usuário criado com sucesso',
      usuario: usuarioSemSenha
    });

  } catch (error) {
    console.error('Erro ao registrar usuário:', error);
    res.status(500).json({
      error: 'Erro ao registrar usuário',
      message: error.message
    });
  }
};
