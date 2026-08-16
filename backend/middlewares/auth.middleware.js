// backend/middlewares/auth.middleware.js
const supabase = require('../config/supabase');

const verificarToken = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ erro: "Acesso negado. Crachá não fornecido." });
  }

  // verificação de token SupaBase
  const { data: { user }, error } = await supabase.auth.getUser(token);

  if (error || !user) {
    return res.status(403).json({ erro: "Token inválido ou expirado." });
  }

  // Salva o usuário na requisição para que o Controller saiba quem está logado
  req.usuario = user;
  
  next();
};

module.exports = verificarToken;