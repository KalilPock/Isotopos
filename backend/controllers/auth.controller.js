const authModel = require("../models/auth.model");

exports.cadastro = async (req, res) => {
  const { usuario, email, senha } = req.body;
  console.log(`[Backend] Tentativa de cadastro recebida para: ${usuario} & email: ${email}`);

  if (!usuario || !email || !senha) {
    return res.status(400).json({ sucesso: false, mensagem: "Preencha todos os campos!" });
  }

  const { data, error } = await authModel.cadastrar(email, senha, usuario);
  if (error) {
    console.log(`[Backend] - Erro no Supabase: ${error.message}`);
    return res.status(400).json({ sucesso: false, mensagem: `Acesso negado: ${error.message}` });
  }

  const token = data.session ? data.session.access_token : null;
  return res.status(201).json({ sucesso: true, mensagem: "Cadastro realizado com sucesso!", token });
};

exports.login = async (req, res) => {
  const { usuario, senha } = req.body;
  console.log(`[Backend] Tentativa de login recebida para: ${usuario}`);

  const { data, error } = await authModel.autenticar(usuario, senha);
  if (error) {
    console.log(`[Backend] Acesso negado: ${error.message}`);
    return res.status(401).json({ sucesso: false, mensagem: "Acesso Negado: Usuário ou senha incorretos!" });
  }

  console.log(`[Backend] Login APROVADO para: ${usuario}`);
  res.json({
    sucesso: true,
    mensagem: "Acesso Autorizado! Bem-vindo.",
    token: data.session.access_token,
  });
};

exports.dadosPainel = async (req, res) => {
  res.json({ mensagem: `Bem-vindo, ${req.usuario.email}!` });
};