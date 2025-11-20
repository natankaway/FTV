import express from 'express';
import {
  listarPlanos,
  buscarPlano,
  criarPlano,
  atualizarPlano,
  deletarPlano
} from '../controllers/planosController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Todas as rotas requerem autenticação
router.use(authenticateToken);

router.get('/', listarPlanos);
router.get('/:id', buscarPlano);
router.post('/', criarPlano);
router.put('/:id', atualizarPlano);
router.delete('/:id', deletarPlano);

export default router;
