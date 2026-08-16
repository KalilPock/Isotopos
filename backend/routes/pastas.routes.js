const express = require('express')
const router = express.Router();
const pastasController = require('../controllers/pastas.controller')

//Organizador rotas
router.post('/', pastasController.criarPasta);
router.get('/', pastasController.listarPastas);
router.put('/:id', pastasController.renomearPasta);
router.delete('/:id', pastasController.deletarPasta);

module.exports = router;