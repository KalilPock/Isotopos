const supabase = require("../config/supabase");

function criar(titulo, pastaId) {
  return supabase
    .from("notas")
    .insert([{ titulo, pasta_id: pastaId, conteudo: "" }])
    .select();
}

function buscarPorId(id) {
  return supabase.from("notas").select("id,pasta_id").eq("id", id).maybeSingle();
}

function listarPorPasta(pastaId) {
  return supabase
    .from("notas")
    .select("*")
    .eq("pasta_id", pastaId)
    .order("criado_em", { ascending: false });
}

function atualizar(id, atualizacoes) {
  return supabase.from("notas").update(atualizacoes).eq("id", id).select();
}

function remover(id) {
  return supabase.from("notas").delete().eq("id", id);
}

module.exports = { criar, listarPorPasta, atualizar, remover, buscarPorId };