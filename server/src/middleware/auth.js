import jwt from 'jsonwebtoken';
import { supabaseAdmin } from '../config/supabase.js';

// Middleware para verificar token JWT
export const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      return res.status(401).json({
        error: 'Token não fornecido',
        message: 'Autenticação necessária'
      });
    }

    // Verificar token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Buscar usuário no banco
    const { data: usuario, error } = await supabaseAdmin
      .from('usuarios')
      .select('*')
      .eq('id', decoded.userId)
      .eq('ativo', true)
      .single();

    if (error || !usuario) {
      return res.status(403).json({
        error: 'Usuário não encontrado ou inativo',
        message: 'Token inválido'
      });
    }

    // Adicionar usuário ao request
    req.user = {
      id: usuario.id,
      authUserId: usuario.auth_user_id,
      nome: usuario.nome,
      email: usuario.email,
      perfil: usuario.perfil,
      unidade: usuario.unidade
    };

    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        error: 'Token expirado',
        message: 'Faça login novamente'
      });
    }

    if (error.name === 'JsonWebTokenError') {
      return res.status(403).json({
        error: 'Token inválido',
        message: 'Autenticação falhou'
      });
    }

    console.error('Erro na autenticação:', error);
    return res.status(500).json({
      error: 'Erro ao autenticar',
      message: error.message
    });
  }
};

// Middleware para verificar permissão por perfil
export const checkRole = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        error: 'Não autenticado',
        message: 'Faça login primeiro'
      });
    }

    if (!allowedRoles.includes(req.user.perfil)) {
      return res.status(403).json({
        error: 'Permissão negada',
        message: `Apenas ${allowedRoles.join(', ')} podem acessar este recurso`
      });
    }

    next();
  };
};

// Middleware para verificar se é o próprio usuário ou admin
export const checkOwnershipOrAdmin = (req, res, next) => {
  const { id } = req.params;

  if (req.user.perfil === 'admin' || req.user.id === id) {
    return next();
  }

  return res.status(403).json({
    error: 'Permissão negada',
    message: 'Você só pode acessar seus próprios dados'
  });
};
