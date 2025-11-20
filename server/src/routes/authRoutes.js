import express from 'express';
import {
  login,
  refreshToken,
  logout,
  verifyToken,
  register
} from '../controllers/authController.js';
import { authenticateToken, checkRole } from '../middleware/auth.js';
import { loginRateLimiterMiddleware } from '../middleware/rateLimiter.js';

const router = express.Router();

// Rotas públicas
router.post('/login', loginRateLimiterMiddleware, login);
router.post('/refresh', refreshToken);
router.post('/logout', logout);

// Rotas protegidas
router.get('/verify', authenticateToken, verifyToken);
router.post('/register', authenticateToken, checkRole('admin'), register);

export default router;
