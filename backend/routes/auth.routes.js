// backend/routes/auth.routes.js
const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const verificarToken = require('../middlewares/auth.middleware');

// Rotas Públicas (Qualquer um pode acessar)
router.post('/cadastro', authController.cadastro);
router.post('/login', authController.login);

// Rota Protegida (Exige que o middleware verifique o token antes de ir para o Controller)
router.get('/dados-painel', verificarToken, authController.dadosPainel);

module.exports = router;