import express from 'express';
import {
  listarProfessores,
  buscarProfessor,
  criarProfessor,
  atualizarProfessor,
  deletarProfessor
} from '../controllers/professoresController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Todas as rotas requerem autenticação
router.use(authenticateToken);

router.get('/', listarProfessores);
router.get('/:id', buscarProfessor);
router.post('/', criarProfessor);
router.put('/:id', atualizarProfessor);
router.delete('/:id', deletarProfessor);

export default router;
