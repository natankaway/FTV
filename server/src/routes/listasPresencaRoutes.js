import express from 'express';
import {
  getListasPresenca,
  getListaPresencaById,
  createListaPresenca,
  updateListaPresenca,
  deleteListaPresenca,
  fazerPreCheckin,
  cancelarPreCheckin,
  confirmarPresenca
} from '../controllers/listasPresencaController.js';
import { authenticateToken, checkRole } from '../middleware/auth.js';

const router = express.Router();

// Todas as rotas requerem autenticação
router.use(authenticateToken);

// Rotas públicas (para usuários autenticados)
router.get('/', getListasPresenca);
router.get('/:id', getListaPresencaById);

// Pre-check-in (alunos podem fazer)
router.post('/:id/pre-checkin', fazerPreCheckin);
router.delete('/:id/pre-checkin/:checkinId', cancelarPreCheckin);

// Rotas administrativas (gestores, professores, admin)
router.post('/', checkRole('admin', 'gestor', 'professor'), createListaPresenca);
router.put('/:id', checkRole('admin', 'gestor', 'professor'), updateListaPresenca);
router.delete('/:id', checkRole('admin', 'gestor'), deleteListaPresenca);
router.post('/:id/confirmar-presenca', checkRole('admin', 'gestor', 'professor'), confirmarPresenca);

export default router;
