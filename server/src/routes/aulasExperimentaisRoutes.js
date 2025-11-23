import express from 'express';
import { listarAulasExperimentais, buscarAulaExperimental, criarAulaExperimental, atualizarAulaExperimental, deletarAulaExperimental } from '../controllers/aulasExperimentaisController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();
router.use(authenticateToken);

router.get('/', listarAulasExperimentais);
router.get('/:id', buscarAulaExperimental);
router.post('/', criarAulaExperimental);
router.put('/:id', atualizarAulaExperimental);
router.delete('/:id', deletarAulaExperimental);

export default router;
