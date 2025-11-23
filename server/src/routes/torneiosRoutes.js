import express from 'express';
import { listarTorneios, buscarTorneio, criarTorneio, atualizarTorneio, deletarTorneio } from '../controllers/torneiosController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();
router.use(authenticateToken);

router.get('/', listarTorneios);
router.get('/:id', buscarTorneio);
router.post('/', criarTorneio);
router.put('/:id', atualizarTorneio);
router.delete('/:id', deletarTorneio);

export default router;
