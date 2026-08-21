const supabase = require("../config/supabase");

exports.criarNota = async (req, res) => {
  const { titulo, pasta_id } = req.body;

  if (!titulo || !pasta_id) {
    return res.status(400).json({
      sucesso: false,
      mensagem: "O titulo e o ID da pasta são obrigatórios",
    });
  }

  //inserir a nota com a chave estrangeira da pasta
  const { data, error } = await supabase
    .from("notas")
    .insert([{ titulo, pasta_id, conteudo: "" }])
    .select();

  if (error) {
    console.error(`[Backend] Erro ao criar a nota: `, error.message);
    return res.status(500).json({ sucesso: false, mensagem: error.message });
  }

  res.status(200).json({ sucesso: true, nota: data[0] });
};
//listar todas notas de uma pasta especifica

exports.atualizaNota = async (req, res) => {
  const { id } = req.params;
  const { titulo, conteudo } = req.body;

  const atualizacoes = {};
  if (titulo !== undefined) atualizacoes.titulo = titulo;
  if (conteudo !== undefined) atualizacoes.conteudo = conteudo;

  const { data, error } = await supabase
    .from("notas")
    .update(atualizacoes)
    .eq("id", id)
    .select();

  if (error) {
    return res.status(500).json({ sucesso: false, mensagem: error.message });
  }

  res.status(200).json({ sucesso: true, notas: data });
};

exports.deletarNota = async (req, res) => {
  const { id } = req.params;
  const { error } = await supabase.from("notas").delete().eq("id", id);

  if(error){
    return res.status(500).json({sucesso: false, mensagem: error.message})
  }

  res.status(200).json({
    sucesso: true, mensagem: "nota deletada!"
  })
};
