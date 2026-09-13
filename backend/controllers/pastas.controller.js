const pastasModel = require("../models/pastas.model");

function obterIdPositivo(valor) {
  if (typeof valor === "number" && Number.isInteger(valor) && valor > 0) return valor;
  if (typeof valor !== "string" || !/^[1-9]\d*$/.test(valor)) return null;
  return Number(valor);
}

exports.criarPasta = async (req, res) => {
  const { nome, pai_id: paiId = null } = req.body;
  const usuarioId = req.usuario.id;
  const paiIdNumerico = paiId === null ? null : obterIdPositivo(paiId);
  if (typeof nome !== "string" || !nome.trim() || nome.length > 120) {
    return res.status(400).json({ sucesso: false, mensagem: "Nome inválido!" });
  }

  if (paiId !== null && !paiIdNumerico) {
    return res.status(400).json({ sucesso: false, mensagem: "Pasta pai inválida!" });
  }

  if (paiId !== null) {
    const { data: pastaPai, error: erroPai } = await pastasModel.buscarPorId(paiIdNumerico, usuarioId);
    if (erroPai) return res.status(500).json({ sucesso: false, mensagem: erroPai.message });
    if (!pastaPai) return res.status(404).json({ sucesso: false, mensagem: "Pasta pai não encontrada!" });
  }

  const { data, error } = await pastasModel.criar(nome.trim(), usuarioId, paiIdNumerico);
  if (error) return res.status(500).json({ sucesso: false, mensagem: error.message });
  res.status(201).json({ sucesso: true, pasta: data[0] });
};

exports.listarPastas = async (req, res) => {
  const { data, error } = await pastasModel.listar(req.usuario.id);
  if (error) return res.status(500).json({ sucesso: false, mensagem: error.message });
  res.status(200).json({ sucesso: true, pastas: data });
};

exports.renomearPasta = async (req, res) => {
  const { nome } = req.body;
  const id = obterIdPositivo(req.params.id);
  if (!Number.isInteger(id) || id <= 0 || typeof nome !== "string" || !nome.trim() || nome.length > 120) {
    return res.status(400).json({ sucesso: false, mensagem: "Dados inválidos!" });
  }

  const { data, error } = await pastasModel.atualizar(id, req.usuario.id, nome.trim());
  if (error) return res.status(500).json({ sucesso: false, mensagem: error.message });
  if (!data.length) return res.status(404).json({ sucesso: false, mensagem: "Pasta não encontrada!" });
  res.status(200).json({ sucesso: true, pasta: data[0] });
};

exports.deletarPasta = async (req, res) => {
  const id = obterIdPositivo(req.params.id);
  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({ sucesso: false, mensagem: "ID inválido!" });
  }

  const { data, error } = await pastasModel.remover(id, req.usuario.id).select("id");
  if (error) return res.status(500).json({ sucesso: false, mensagem: error.message });
  if (!data.length) return res.status(404).json({ sucesso: false, mensagem: "Pasta não encontrada!" });
  res.status(200).json({ sucesso: true, mensagem: "Pasta deletada" });
};