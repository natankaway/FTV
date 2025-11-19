// Middleware global de tratamento de erros
export const errorHandler = (err, req, res, next) => {
  console.error('Error:', err);

  // Erros de validação
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      error: 'Erro de validação',
      message: err.message,
      details: err.errors
    });
  }

  // Erros do Supabase
  if (err.code) {
    // Violação de constraint única
    if (err.code === '23505') {
      return res.status(409).json({
        error: 'Registro duplicado',
        message: 'Já existe um registro com esses dados',
        details: err.detail
      });
    }

    // Violação de foreign key
    if (err.code === '23503') {
      return res.status(400).json({
        error: 'Referência inválida',
        message: 'Registro referenciado não existe',
        details: err.detail
      });
    }
  }

  // Erro padrão
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    error: err.name || 'Erro interno',
    message: err.message || 'Algo deu errado',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};

// Middleware para rotas não encontradas
export const notFound = (req, res, next) => {
  res.status(404).json({
    error: 'Não encontrado',
    message: `Rota ${req.originalUrl} não encontrada`
  });
};
