import express from 'express';
import {
  listarTransacoes,
  buscarTransacao,
  obterResumo,
  criarTransacao,
  atualizarTransacao,
  deletarTransacao
} from '../controllers/financeiroController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Todas as rotas requerem autenticação
router.use(authenticateToken);

router.get('/', listarTransacoes);
router.get('/resumo', obterResumo);
router.get('/:id', buscarTransacao);
router.post('/', criarTransacao);
router.put('/:id', atualizarTransacao);
router.delete('/:id', deletarTransacao);

export default router;
