// backend/server.js
require("dotenv").config();
const express = require("express");
const cors = require('cors');

//Importa as rotas
const pastasRoutes = require('./routes/pastas.routes');
// const authRoutes = require('./routes/auth.routes'); // Futuramente

const app = express();

app.use(cors());
app.use(express.json());

//Conecta as rotas
app.use('/api/pastas', pastasRoutes);
// app.use('/api/auth', authRoutes); // Futuramente

// Tratamento de Erro 
app.use((req, res) => {
  res.status(404).json({ sucesso: false, mensagem: `Rota não encontrada` });
});

//Inicializa o Servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`[Backend] Sistema rodando na porta ${PORT}`);
});