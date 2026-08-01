// backend/server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');

const app = express();

app.use(cors());
app.use(express.json());

// Declaração global das chaves e do cliente Supabase
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// Rota de teste
app.get('/api/status', (req, res) => {
  res.json({ status: 'online', mensagem: 'Servidor Isótopos ativo!' });
});

// Rota oficial de Login integrada com o Supabase
app.post('/api/login', async (req, res) => {
  const { usuario, senha } = req.body;

  console.log(`[Backend] Tentativa de login recebida: ${usuario}`);

  // Truque: mapeia o nome de usuário simples para o formato de email do Supabase
  const emailSupabase = `${usuario}@isotopos.com`;

  const { data, error } = await supabase.auth.signInWithPassword({
    email: emailSupabase,
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
  res.json({ 
    sucesso: true, 
    mensagem: `Acesso Autorizado! Bem-vindo de volta, ${usuario}.` 
  });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`\n--- SISTEMA ISÓTOPOS ---`);
  console.log(`[Backend] Rodando na porta: ${PORT}`);
  
  if (supabaseUrl && supabaseKey) {
    console.log(`[Database] Supabase inicializado com sucesso!`);
  } else {
    console.log(`[Database] ERRO: Chaves não encontradas no .env`);
  }
});