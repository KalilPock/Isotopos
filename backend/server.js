// backend/server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');

const app = express();

app.use(cors());
app.use(express.json());

// Declaração global das chaves e do cliente Supabase
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

const verificarToken = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ erro: 'Acesso negado. Crachá não fornecido.' });
  }

  const { data: { user }, error } = await supabase.auth.getUser(token);

  if (error || !user) {
    return res.status(403).json({ erro: 'Token inválido ou expirado.' });
  }

  req.usuario = user;
  next();
};

//exibe layout padrão para rotas inexistentes
const verificaRotas = async (req, res) =>{
  const url = req.originalUrl;

  res.status(404).json({
    sucesso: false,
    mensagem:`Erro 404: a rota ${url} não existe no sistema`
  })

}

//rota do painel
app.get('/api/dados-painel', verificarToken, async (req, res) => {
  // Só chega aqui se o token for válido
  res.json({ mensagem: `Bem-vindo, ${req.usuario.email}!` });
});

// Rota de teste
app.get('/api/status', (req, res) => {
  res.json({ status: 'online', mensagem: 'Servidor Isótopos ativo!' });
});

// Rota oficial de Login integrada com o Supabase
app.post('/api/login', async (req, res) => {
  const { usuario, senha } = req.body;

  console.log(`[Backend] Tentativa de login recebida para: ${usuario}`);

  // Agora passamos a variável 'usuario' DIRETAMENTE para o campo 'email', 
  // sem concatenar nada falso no final.
  const { data, error } = await supabase.auth.signInWithPassword({
    email: usuario, 
    password: senha,
  });

  if (error) {
    console.log(`[Backend] Acesso negado: ${error.message}`);
    return res.status(401).json({ 
      sucesso: false, 
      mensagem: 'Acesso Negado: Usuário ou senha incorretos!' 
    });
  }

  console.log(`[Backend] Login APROVADO para: ${usuario}`);
  
  // O Supabase devolve o token dentro de data.session.access_token
  res.json({ 
    sucesso: true, 
    mensagem: `Acesso Autorizado! Bem-vindo.`,
    token: data.session.access_token 
  });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`\n--- SISTEMA ISÓTOPOS ---`);
  console.log(`[Backend] Rodando na porta: ${PORT}`);
  
  // Corrigido para buscar direto das variáveis de ambiente
  if (process.env.SUPABASE_URL && process.env.SUPABASE_KEY) {
    console.log(`[Database] Supabase inicializado com sucesso!`);
  } else {
    console.log(`[Database] ERRO: Chaves não encontradas no .env`);
  }
});