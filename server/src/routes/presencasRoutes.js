import express from 'express';
import {
  listarPresencas,
  buscarPresenca,
  buscarPresencasPorAluno,
  criarPresenca,
  atualizarPresenca,
  deletarPresenca
} from '../controllers/presencasController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Todas as rotas requerem autenticação
router.use(authenticateToken);

router.get('/', listarPresencas);
router.get('/aluno/:alunoId', buscarPresencasPorAluno);
router.get('/:id', buscarPresenca);
router.post('/', criarPresenca);
router.put('/:id', atualizarPresenca);
router.delete('/:id', deletarPresenca);

export default router;
