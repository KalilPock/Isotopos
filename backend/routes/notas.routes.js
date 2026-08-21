// backend/routes/notas.routes.js
const express = require('express');
const router = express.Router();
const notasController = require('../controllers/notas.controller');

router.post('/', notasController.criarNota);
router.get('/pasta/:pasta_id', notasController.listarNotasDaPasta);
router.put('/:id', notasController.atualizarNota);
router.delete('/:id', notasController.deletarNota);

module.exports = router;