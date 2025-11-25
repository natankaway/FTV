import express from 'express';
import {
  getConquistas,
  getConquistaById,
  getConquistasAluno,
  createConquista,
  desbloquearConquista,
  updateConquista,
  deleteConquista
} from '../controllers/conquistasController.js';
import { authenticateToken, checkRole } from '../middleware/auth.js';

const router = express.Router();

// Todas as rotas requerem autenticação
router.use(authenticateToken);

// Rotas de consulta (todos podem ver)
router.get('/', getConquistas);
router.get('/:id', getConquistaById);
router.get('/aluno/:alunoId', getConquistasAluno);

// Criar conquista (admin e gestor)
router.post('/', checkRole('admin', 'gestor'), createConquista);

// Desbloquear conquista (admin, gestor e professor)
router.put('/:id/desbloquear', checkRole('admin', 'gestor', 'professor'), desbloquearConquista);

// Editar/deletar (admin e gestor)
router.put('/:id', checkRole('admin', 'gestor'), updateConquista);
router.delete('/:id', checkRole('admin', 'gestor'), deleteConquista);

export default router;
