import express from 'express';
import {
  getAutoAvaliacoes,
  getAutoAvaliacaoById,
  getAutoAvaliacoesAluno,
  createAutoAvaliacao,
  updateAutoAvaliacao,
  deleteAutoAvaliacao,
  getEvolucaoNotas
} from '../controllers/autoAvaliacoesController.js';
import { authenticateToken, checkRole } from '../middleware/auth.js';

const router = express.Router();

// Todas as rotas requerem autenticação
router.use(authenticateToken);

// Rotas de consulta
router.get('/', getAutoAvaliacoes);
router.get('/:id', getAutoAvaliacaoById);
router.get('/aluno/:alunoId', getAutoAvaliacoesAluno);
router.get('/aluno/:alunoId/evolucao', getEvolucaoNotas);

// Criar auto-avaliação (alunos criam suas próprias, professores/gestores podem criar para alunos)
router.post('/', createAutoAvaliacao);

// Editar/deletar (próprio aluno ou gestor/admin)
router.put('/:id', updateAutoAvaliacao);
router.delete('/:id', deleteAutoAvaliacao);

export default router;
