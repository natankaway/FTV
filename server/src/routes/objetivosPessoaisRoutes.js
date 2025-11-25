import express from 'express';
import {
  getObjetivos,
  getObjetivoById,
  getObjetivosAluno,
  createObjetivo,
  updateObjetivo,
  atualizarProgresso,
  cancelarObjetivo,
  deleteObjetivo
} from '../controllers/objetivosPessoaisController.js';
import { authenticateToken, checkRole } from '../middleware/auth.js';

const router = express.Router();

// Todas as rotas requerem autenticação
router.use(authenticateToken);

// Rotas de consulta
router.get('/', getObjetivos);
router.get('/:id', getObjetivoById);
router.get('/aluno/:alunoId', getObjetivosAluno);

// Criar objetivo (alunos podem criar seus próprios, gestores/admin podem criar para qualquer um)
router.post('/', createObjetivo);

// Atualizar progresso (todos podem atualizar)
router.put('/:id/progresso', atualizarProgresso);

// Cancelar objetivo
router.put('/:id/cancelar', cancelarObjetivo);

// Editar/deletar
router.put('/:id', updateObjetivo);
router.delete('/:id', deleteObjetivo);

export default router;
