import express from 'express';
import {
  listarMetasGerais,
  buscarMetaGeral,
  criarMetaGeral,
  atualizarMetaGeral,
  atualizarProgressoMeta,
  deletarMetaGeral,
  obterEstatisticasMetas
} from '../controllers/metasGeraisController.js';

const router = express.Router();

// Rotas de metas gerais
router.get('/', listarMetasGerais);
router.get('/estatisticas', obterEstatisticasMetas);
router.get('/:id', buscarMetaGeral);
router.post('/', criarMetaGeral);
router.put('/:id', atualizarMetaGeral);
router.patch('/:id/progresso', atualizarProgressoMeta);
router.delete('/:id', deletarMetaGeral);

export default router;
