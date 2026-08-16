// backend/controllers/auth.controller.js
const supabase = require('../config/supabase');

// Lógica de Cadastro
exports.cadastro = async (req, res) => {
  const { usuario, email, senha } = req.body;
  console.log(`[Backend] Tentativa de cadastro recebida para: ${usuario} & email: ${email}`);

  if (!usuario || !email || !senha) {
    console.log(`[Backend] Erro: dados insuficientes no formulário!`);
    return res.status(400).json({ sucesso: false, mensagem: "Preencha todos os campos!" });
  }

  const { data, error } = await supabase.auth.signUp({
    email: email,
    password: senha,
    options: {
      data: { username: usuario }
    }
  });

  if (error) {
    console.log(`[Backend] - Erro no Supabase: ${error.message}`);
    return res.status(400).json({ sucesso: false, mensagem: `Acesso negado: ${error.message}` });
  }

  console.log(`[Backend] - Cadastro aprovado! usuário: ${usuario}`);
  const token = data.session ? data.session.access_token : null;

  return res.status(201).json({ sucesso: true, mensagem: "Cadastro realizado com sucesso!", token });
};

// Lógica de Login
exports.login = async (req, res) => {
  const { usuario, senha } = req.body;
  console.log(`[Backend] Tentativa de login recebida para: ${usuario}`);

  const { data, error } = await supabase.auth.signInWithPassword({
    email: usuario,
    password: senha,
  });

  if (error) {
    console.log(`[Backend] Acesso negado: ${error.message}`);
    return res.status(401).json({ sucesso: false, mensagem: "Acesso Negado: Usuário ou senha incorretos!" });
  }

  console.log(`[Backend] Login APROVADO para: ${usuario}`);

  res.json({
    sucesso: true,
    mensagem: `Acesso Autorizado! Bem-vindo.`,
    token: data.session.access_token,
  });
};

// Lógica para Rota Protegida (O antigo /api/dados-painel)
exports.dadosPainel = async (req, res) => {
  // Como o auth.middleware.js passou por aqui antes, temos o req.usuario
  res.json({ mensagem: `Bem-vindo, ${req.usuario.email}!` });
};