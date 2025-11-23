import express from 'express';
import { listarHorarios, buscarHorario, criarHorario, atualizarHorario, deletarHorario } from '../controllers/horariosController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();
router.use(authenticateToken);

router.get('/', listarHorarios);
router.get('/:id', buscarHorario);
router.post('/', criarHorario);
router.put('/:id', atualizarHorario);
router.delete('/:id', deletarHorario);

export default router;
