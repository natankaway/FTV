import express from 'express';
import {
  getAlunos,
  getAlunoById,
  createAluno,
  updateAluno,
  deleteAluno,
  getAlunoStats
} from '../controllers/alunosController.js';
import { authenticateToken, checkRole } from '../middleware/auth.js';

const router = express.Router();

// Todas as rotas requerem autenticação
router.use(authenticateToken);

// Rotas de alunos
router.get('/', getAlunos);
router.get('/:id', getAlunoById);
router.get('/:id/stats', getAlunoStats);

// Apenas admin e gestor podem criar/editar/deletar
router.post('/', checkRole('admin', 'gestor'), createAluno);
router.put('/:id', checkRole('admin', 'gestor'), updateAluno);
router.delete('/:id', checkRole('admin'), deleteAluno);

export default router;
