import express from 'express';
import { listarTreinos, buscarTreino, criarTreino, atualizarTreino, deletarTreino } from '../controllers/treinosController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();
router.use(authenticateToken);

router.get('/', listarTreinos);
router.get('/:id', buscarTreino);
router.post('/', criarTreino);
router.put('/:id', atualizarTreino);
router.delete('/:id', deletarTreino);

export default router;
