import express from 'express';
import { listarAgendamentos, buscarAgendamento, criarAgendamento, atualizarAgendamento, deletarAgendamento } from '../controllers/agendamentosController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();
router.use(authenticateToken);

router.get('/', listarAgendamentos);
router.get('/:id', buscarAgendamento);
router.post('/', criarAgendamento);
router.put('/:id', atualizarAgendamento);
router.delete('/:id', deletarAgendamento);

export default router;
