import { RateLimiterMemory } from 'rate-limiter-flexible';

// Rate limiter para requisições gerais
const rateLimiter = new RateLimiterMemory({
  points: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100,
  duration: parseInt(process.env.RATE_LIMIT_WINDOW_MS) / 1000 || 900, // 15 minutos
});

// Rate limiter mais restritivo para login
const loginRateLimiter = new RateLimiterMemory({
  points: 5, // 5 tentativas
  duration: 900, // por 15 minutos
  blockDuration: 900, // bloquear por 15 minutos após exceder
});

export const rateLimiterMiddleware = async (req, res, next) => {
  try {
    const key = req.ip || req.connection.remoteAddress;
    await rateLimiter.consume(key);
    next();
  } catch (error) {
    res.status(429).json({
      error: 'Muitas requisições',
      message: 'Você excedeu o limite de requisições. Tente novamente mais tarde.',
      retryAfter: Math.round(error.msBeforeNext / 1000) || 900
    });
  }
};

export const loginRateLimiterMiddleware = async (req, res, next) => {
  try {
    const key = req.ip || req.connection.remoteAddress;
    await loginRateLimiter.consume(key);
    next();
  } catch (error) {
    res.status(429).json({
      error: 'Muitas tentativas de login',
      message: 'Você excedeu o limite de tentativas de login. Tente novamente em 15 minutos.',
      retryAfter: Math.round(error.msBeforeNext / 1000) || 900
    });
  }
};
