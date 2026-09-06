const notasModel = require("../models/notas.model");

exports.criarNota = async (req, res) => {
  const { titulo, pasta_id: pastaId } = req.body;
  if (!titulo || !pastaId) {
    return res.status(400).json({ sucesso: false, mensagem: "O titulo e o ID da pasta são obrigatórios" });
  }

  const { data, error } = await notasModel.criar(titulo, pastaId);
  if (error) {
    console.error("[Backend] Erro ao criar a nota:", error.message);
    return res.status(500).json({ sucesso: false, mensagem: error.message });
  }
  res.status(201).json({ sucesso: true, nota: data[0] });
};

exports.listarNotasDaPasta = async (req, res) => {
  const { pasta_id: pastaId } = req.params;
  const { data, error } = await notasModel.listarPorPasta(pastaId);
  if (error) return res.status(500).json({ sucesso: false, mensagem: error.message });
  res.status(200).json({ sucesso: true, notas: data });
};

exports.atualizarNota = async (req, res) => {
  const { id } = req.params;
  const { titulo, conteudo } = req.body;
  const atualizacoes = {};
  if (titulo !== undefined) atualizacoes.titulo = titulo;
  if (conteudo !== undefined) atualizacoes.conteudo = conteudo;

  const { data, error } = await notasModel.atualizar(id, atualizacoes);
  if (error) return res.status(500).json({ sucesso: false, mensagem: error.message });
  res.status(200).json({ sucesso: true, notas: data });
};

exports.deletarNota = async (req, res) => {
  const { error } = await notasModel.remover(req.params.id);
  if (error) return res.status(500).json({ sucesso: false, mensagem: error.message });
  res.status(200).json({ sucesso: true, mensagem: "nota deletada!" });
};