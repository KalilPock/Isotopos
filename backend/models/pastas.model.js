const supabase = require("../config/supabase");

function criar(nome) {
  return supabase.from("pastas").insert([{ nome }]).select();
}

function listar() {
  return supabase.from("pastas").select("*").order("criado_em", { ascending: true });
}

function atualizar(id, nome) {
  return supabase.from("pastas").update({ nome }).eq("id", id).select();
}

function remover(id) {
  return supabase.from("pastas").delete().eq("id", id);
}

module.exports = { criar, listar, atualizar, remover };