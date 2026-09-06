const supabase = require("../config/supabase");

function cadastrar(email, senha, usuario) {
  return supabase.auth.signUp({
    email,
    password: senha,
    options: { data: { username: usuario } },
  });
}

function autenticar(email, senha) {
  return supabase.auth.signInWithPassword({ email, password: senha });
}

module.exports = { cadastrar, autenticar };