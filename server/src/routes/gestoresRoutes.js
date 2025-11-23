import express from 'express';
import { listarGestores, buscarGestor, criarGestor, atualizarGestor, deletarGestor } from '../controllers/gestoresController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();
router.use(authenticateToken);

router.get('/', listarGestores);
router.get('/:id', buscarGestor);
router.post('/', criarGestor);
router.put('/:id', atualizarGestor);
router.delete('/:id', deletarGestor);

export default router;
