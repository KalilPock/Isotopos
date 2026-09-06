function obterApiUrl() {
  return import.meta.env.PUBLIC_API_URL || "http://localhost:3000";
}

function obterValor(id) {
  return document.getElementById(id)?.value.trim() || "";
}

async function enviarAutenticacao(url, corpo, mensagemPadrao) {
  try {
    const resposta = await fetch(`${obterApiUrl()}${url}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(corpo),
    });
    const dados = await resposta.json();

    if (!resposta.ok) {
      alert(dados.mensagem || mensagemPadrao);
      return;
    }

    localStorage.setItem("eva_token", dados.token);
    window.location.href = "/painel";
  } catch (erro) {
    console.error("Erro:", erro);
    alert("O servidor backend está offline.");
  }
}

export function configurarLogin() {
  const form = document.getElementById("form-login");
  if (!form || form.dataset.authHandler) return;

  form.addEventListener("submit", async (evento) => {
    evento.preventDefault();
    const usuario = obterValor("usuario");
    const senha = obterValor("senha");

    if (!usuario || !senha) {
      alert("Preencha todos os campos!");
      return;
    }

    await enviarAutenticacao("/api/login", { usuario, senha }, "Erro ao fazer login");
  });
  form.dataset.authHandler = "1";
}

export function configurarCadastro() {
  const form = document.getElementById("form-email");
  if (!form || form.dataset.authHandler) return;

  form.addEventListener("submit", async (evento) => {
    evento.preventDefault();
    const usuario = obterValor("usuario");
    const email = obterValor("email");
    const senha = obterValor("senha");

    if (!usuario || !email || !senha) {
      alert("Preencha todos os campos!");
      return;
    }

    await enviarAutenticacao("/api/cadastro", { usuario, email, senha }, "Erro ao cadastrar");
  });
  form.dataset.authHandler = "1";
}