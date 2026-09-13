const notasModel = require("../models/notas.model");
const pastasModel = require("../models/pastas.model");

function obterIdPositivo(valor) {
  if (typeof valor === "number" && Number.isInteger(valor) && valor > 0) return valor;
  if (typeof valor !== "string" || !/^[1-9]\d*$/.test(valor)) return null;
  return Number(valor);
}

async function pastaPertenceAoUsuario(pastaId, usuarioId) {
  const { data, error } = await pastasModel.buscarPorId(pastaId, usuarioId);
  if (error) throw error;
  return Boolean(data);
}

exports.criarNota = async (req, res) => {
  const { titulo, pasta_id: pastaId } = req.body;
  const pastaIdNumerico = obterIdPositivo(pastaId);
  if (typeof titulo !== "string" || !titulo.trim() || titulo.length > 200 || !pastaIdNumerico) {
    return res.status(400).json({ sucesso: false, mensagem: "Título ou pasta inválidos" });
  }

  try {
    if (!await pastaPertenceAoUsuario(pastaIdNumerico, req.usuario.id)) {
      return res.status(404).json({ sucesso: false, mensagem: "Pasta não encontrada" });
    }
  } catch (error) {
    return res.status(500).json({ sucesso: false, mensagem: error.message });
  }

  const { data, error } = await notasModel.criar(titulo.trim(), pastaIdNumerico);
  if (error) {
    console.error("[Backend] Erro ao criar a nota:", error.message);
    return res.status(500).json({ sucesso: false, mensagem: error.message });
  }
  res.status(201).json({ sucesso: true, nota: data[0] });
};

exports.listarNotasDaPasta = async (req, res) => {
  const pastaId = obterIdPositivo(req.params.pasta_id);
  if (!pastaId) return res.status(400).json({ sucesso: false, mensagem: "ID da pasta inválido" });

  try {
    if (!await pastaPertenceAoUsuario(pastaId, req.usuario.id)) {
      return res.status(404).json({ sucesso: false, mensagem: "Pasta não encontrada" });
    }
  } catch (error) {
    return res.status(500).json({ sucesso: false, mensagem: error.message });
  }

  const { data, error } = await notasModel.listarPorPasta(pastaId);
  if (error) return res.status(500).json({ sucesso: false, mensagem: error.message });
  res.status(200).json({ sucesso: true, notas: data });
};

exports.atualizarNota = async (req, res) => {
  const id = obterIdPositivo(req.params.id);
  const { titulo, conteudo } = req.body;
  if (!id || (titulo !== undefined && (typeof titulo !== "string" || !titulo.trim() || titulo.length > 200)) || (conteudo !== undefined && typeof conteudo !== "string")) {
    return res.status(400).json({ sucesso: false, mensagem: "Dados inválidos" });
  }

  const atualizacoes = {};
  if (titulo !== undefined) atualizacoes.titulo = titulo.trim();
  if (conteudo !== undefined) atualizacoes.conteudo = conteudo;
  if (!Object.keys(atualizacoes).length) {
    return res.status(400).json({ sucesso: false, mensagem: "Nenhuma alteração informada" });
  }

  const { data: nota, error: erroNota } = await notasModel.buscarPorId(id);
  if (erroNota) return res.status(500).json({ sucesso: false, mensagem: erroNota.message });
  if (!nota) return res.status(404).json({ sucesso: false, mensagem: "Nota não encontrada" });

  try {
    if (!await pastaPertenceAoUsuario(nota.pasta_id, req.usuario.id)) {
      return res.status(404).json({ sucesso: false, mensagem: "Nota não encontrada" });
    }
  } catch (error) {
    return res.status(500).json({ sucesso: false, mensagem: error.message });
  }

  const { data, error } = await notasModel.atualizar(id, atualizacoes);
  if (error) return res.status(500).json({ sucesso: false, mensagem: error.message });
  res.status(200).json({ sucesso: true, notas: data });
};

exports.deletarNota = async (req, res) => {
  const id = obterIdPositivo(req.params.id);
  if (!id) return res.status(400).json({ sucesso: false, mensagem: "ID da nota inválido" });

  const { data: nota, error: erroNota } = await notasModel.buscarPorId(id);
  if (erroNota) return res.status(500).json({ sucesso: false, mensagem: erroNota.message });
  if (!nota) return res.status(404).json({ sucesso: false, mensagem: "Nota não encontrada" });

  try {
    if (!await pastaPertenceAoUsuario(nota.pasta_id, req.usuario.id)) {
      return res.status(404).json({ sucesso: false, mensagem: "Nota não encontrada" });
    }
  } catch (error) {
    return res.status(500).json({ sucesso: false, mensagem: error.message });
  }

  const { error } = await notasModel.remover(id);
  if (error) return res.status(500).json({ sucesso: false, mensagem: error.message });
  res.status(200).json({ sucesso: true, mensagem: "nota deletada!" });
};