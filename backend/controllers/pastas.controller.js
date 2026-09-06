const pastasModel = require("../models/pastas.model");

exports.criarPasta = async (req, res) => {
  const { nome } = req.body;
  if (!nome) return res.status(400).json({ sucesso: false, mensagem: "Nome obrigatório!" });

  const { data, error } = await pastasModel.criar(nome);
  if (error) return res.status(500).json({ sucesso: false, mensagem: error.message });
  res.status(201).json({ sucesso: true, pasta: data[0] });
};

exports.listarPastas = async (req, res) => {
  const { data, error } = await pastasModel.listar();
  if (error) return res.status(500).json({ sucesso: false, mensagem: error.message });
  res.status(200).json({ sucesso: true, pastas: data });
};

exports.renomearPasta = async (req, res) => {
  const { nome } = req.body;
  if (!nome) return res.status(400).json({ sucesso: false, mensagem: "Nome obrigatório!" });

  const { data, error } = await pastasModel.atualizar(req.params.id, nome);
  if (error) return res.status(500).json({ sucesso: false, mensagem: error.message });
  res.status(200).json({ sucesso: true, pasta: data[0] });
};

exports.deletarPasta = async (req, res) => {
  const { error } = await pastasModel.remover(req.params.id);
  if (error) return res.status(500).json({ sucesso: false, mensagem: error.message });
  res.status(200).json({ sucesso: true, mensagem: "Pasta deletada" });
};