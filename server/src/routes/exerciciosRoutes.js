import express from 'express';
import { listarExercicios, buscarExercicio, criarExercicio, atualizarExercicio, deletarExercicio } from '../controllers/exerciciosController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();
router.use(authenticateToken);

router.get('/', listarExercicios);
router.get('/:id', buscarExercicio);
router.post('/', criarExercicio);
router.put('/:id', atualizarExercicio);
router.delete('/:id', deletarExercicio);

export default router;
