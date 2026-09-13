const supabase = require("../config/supabase");

function criar(nome, usuarioId, paiId = null) {
  return supabase
    .from("pastas")
    .insert([{ nome, usuario_id: usuarioId, pai_id: paiId }])
    .select("id,nome,pai_id,criado_em");
}

function listar(usuarioId) {
  return supabase
    .from("pastas")
    .select("id,nome,pai_id,criado_em")
    .eq("usuario_id", usuarioId)
    .order("criado_em", { ascending: true });
}

function atualizar(id, usuarioId, nome) {
  return supabase
    .from("pastas")
    .update({ nome })
    .eq("id", id)
    .eq("usuario_id", usuarioId)
    .select("id,nome,pai_id,criado_em");
}

function remover(id, usuarioId) {
  return supabase.from("pastas").delete().eq("id", id).eq("usuario_id", usuarioId);
}

function buscarPorId(id, usuarioId) {
  return supabase.from("pastas").select("id").eq("id", id).eq("usuario_id", usuarioId).maybeSingle();
}

module.exports = { criar, listar, atualizar, remover, buscarPorId };