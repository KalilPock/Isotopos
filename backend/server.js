// backend/server.js

require("dotenv").config();
const express = require("express");
const cors = require('cors');
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");

//ativando Middleware
// Importação dos Módulos (Routers)
const authRoutes = require('./routes/auth.routes');
const notasRoutes = require('./routes/notas.routes');
const pastasRoutes = require('./routes/pastas.routes');
const verificarToken = require('./middlewares/auth.middleware'); 

const app = express();

const origensConfiguradas = (process.env.FRONTEND_URL || "")
  .split(",")
  .map((origem) => origem.trim())
  .filter(Boolean);
const origensLocais = process.env.NODE_ENV === "production"
  ? []
  : ["http://localhost:4321", "http://127.0.0.1:4321"];
const origensPermitidas = [...new Set([...origensConfiguradas, ...origensLocais])];
const limiteAutenticacao = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 20,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: { sucesso: false, mensagem: "Muitas tentativas. Tente novamente mais tarde." },
});

app.use(helmet());
app.use(cors({
  origin(origem, callback) {
    if (!origem || origensPermitidas.includes(origem)) return callback(null, true);
    return callback(new Error("Origem não permitida"));
  },
}));
app.use(express.json({ limit: "100kb" }));
app.use("/api/login", limiteAutenticacao);
app.use("/api/cadastro", limiteAutenticacao);
app.use('/api/notas', verificarToken, notasRoutes); // 

// Rota de Status (Deixamos direto aqui para verificações rápidas de integridade do Render)
app.get("/api/status", (req, res) => {
  res.json({ status: "online", mensagem: "Servidor Isótopos ativo!" });
});

//ativando rotas
app.use('/api', authRoutes);
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