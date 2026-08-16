// backend/controllers/pastas.controller.js
const supabase = require('../config/supabase');

// Exportamos as funções diretamente
exports.criarPasta = async (req, res) => {
  const { nome } = req.body;
  if (!nome) return res.status(400).json({ sucesso: false, mensagem: 'Nome obrigatório!' });

  const { data, error } = await supabase.from('pastas').insert([{ nome }]).select();
  
  if (error) return res.status(500).json({ sucesso: false, mensagem: error.message });
  res.status(201).json({ sucesso: true, pasta: data[0] });
};

exports.listarPastas = async (req, res) => {
  const { data, error } = await supabase.from('pastas').select('*').order('criado_em', { ascending: true });
  
  if (error) return res.status(500).json({ sucesso: false, mensagem: error.message });
  res.status(200).json({ sucesso: true, pastas: data });
};

exports.renomearPasta = async (req, res) => {
  const { id } = req.params;
  const { nome } = req.body;

  const { data, error } = await supabase.from('pastas').update({ nome }).eq('id', id).select();
  if (error) return res.status(500).json({ sucesso: false, mensagem: error.message });
  res.status(200).json({ sucesso: true, pasta: data[0] });
};

exports.deletarPasta = async (req, res) => {
  const { id } = req.params;

  const { error } = await supabase.from('pastas').delete().eq('id', id);
  if (error) return res.status(500).json({ sucesso: false, mensagem: error.message });
  res.status(200).json({ sucesso: true, mensagem: 'Pasta deletada' });
};