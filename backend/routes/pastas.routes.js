const express = require('express')
const router = express.Router();
const pastasController = require('../controllers/pastas.controller')

//Organizador rotas
router.post('/', pastasController.criarPasta);
router.get('/', pastasController.listarPasta);
router.put('/:id', pastasController.renomearPasta);
router.delete('/:id', pastasController.deletarPasta);