import express from 'express';
import {
  listarUnidades,
  buscarUnidade,
  criarUnidade,
  atualizarUnidade,
  deletarUnidade
} from '../controllers/unidadesController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Todas as rotas requerem autenticação
router.use(authenticateToken);

router.get('/', listarUnidades);
router.get('/:id', buscarUnidade);
router.post('/', criarUnidade);
router.put('/:id', atualizarUnidade);
router.delete('/:id', deletarUnidade);

export default router;
