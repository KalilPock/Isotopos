// backend/server.js

require("dotenv").config();
const express = require("express");
const cors = require('cors');

//ativando Middleware
// Importação dos Módulos (Routers)
const authRoutes = require('./routes/auth.routes');
const pastasRoutes = require('./routes/pastas.routes');
const verificarToken = require('./middlewares/auth.middleware'); 

const app = express();

app.use(cors());
app.use(express.json());

// Rota de Status (Deixamos direto aqui para verificações rápidas de integridade do Render)
app.get("/api/status", (req, res) => {
  res.json({ status: "online", mensagem: "Servidor Isótopos ativo!" });
});

app.use('/api/pastas', verificarToken, pastasRoutes);

// Tratamento de Rota 404
const verificaRotas = (req, res) => {
  const url = req.originalUrl;
  res.status(404).json({ sucesso: false, mensagem: `Erro 404: a rota ${url} não existe no sistema` });
};
app.use(verificaRotas);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`\n--- SISTEMA ISÓTOPOS ---`);
  console.log(`[Backend] Rodando na porta: ${PORT}`);

  if (process.env.SUPABASE_URL && process.env.SUPABASE_KEY) {
    console.log(`[Database] Supabase inicializado com sucesso!`);
  } else {
    console.log(`[Database] ERRO: Chaves não encontradas no .env`);
  }
});