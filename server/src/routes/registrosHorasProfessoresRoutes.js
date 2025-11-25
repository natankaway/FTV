import express from 'express';
import {
  getRegistrosHoras,
  getRegistroHoraById,
  createRegistroHora,
  updateRegistroHora,
  deleteRegistroHora,
  getRelatorioHoras
} from '../controllers/registrosHorasProfessoresController.js';
import { authenticateToken, checkRole } from '../middleware/auth.js';

const router = express.Router();

// Todas as rotas requerem autenticação
router.use(authenticateToken);

// Rotas públicas (para usuários autenticados - filtradas no controller)
router.get('/', getRegistrosHoras);
router.get('/relatorio', getRelatorioHoras);
router.get('/:id', getRegistroHoraById);

// Rotas para criar/editar (professores podem criar seus próprios, gestores/admin podem criar para qualquer um)
router.post('/', checkRole('admin', 'gestor', 'professor'), createRegistroHora);
router.put('/:id', checkRole('admin', 'gestor', 'professor'), updateRegistroHora);

// Apenas admin e gestor podem deletar
router.delete('/:id', checkRole('admin', 'gestor'), deleteRegistroHora);

export default router;
