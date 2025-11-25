import express from 'express';
import {
  getAvaliacoes,
  getAvaliacaoById,
  getHistoricoAvaliacoesAluno,
  createAvaliacao,
  updateAvaliacao,
  deleteAvaliacao,
  getAlunosPendentesAvaliacao
} from '../controllers/avaliacoesNivelController.js';
import { authenticateToken, checkRole } from '../middleware/auth.js';

const router = express.Router();

// Todas as rotas requerem autenticação
router.use(authenticateToken);

// Rotas de consulta
router.get('/', getAvaliacoes);
router.get('/alunos-pendentes', checkRole('admin', 'gestor', 'professor'), getAlunosPendentesAvaliacao);
router.get('/:id', getAvaliacaoById);
router.get('/aluno/:alunoId/historico', getHistoricoAvaliacoesAluno);

// Apenas professores, gestores e admin podem criar/editar avaliações
router.post('/', checkRole('admin', 'gestor', 'professor'), createAvaliacao);
router.put('/:id', checkRole('admin', 'gestor', 'professor'), updateAvaliacao);
router.delete('/:id', checkRole('admin', 'gestor'), deleteAvaliacao);

export default router;
