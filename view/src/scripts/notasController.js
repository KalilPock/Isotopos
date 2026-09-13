let limparGerenciadorNotasAnterior = null;

function escaparHtml(valor) {
  return String(valor).replace(/[&<>"']/g, (caractere) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  })[caractere]);
}

export function iniciarGerenciadorNotas() {
  limparGerenciadorNotasAnterior?.();
  const abortController = new AbortController();
  limparGerenciadorNotasAnterior = () => abortController.abort();
  const listenerOptions = { signal: abortController.signal };

  let pastaAtivaId = null;
  let notaAtivaId = null;
  let listaNotasAtual = [];
  let botoesGlobaisConfigurados = false;
  let pastaEmEdicaoId = null;

  function obterToken() {
    const token = localStorage.getItem("eva_token");
    if (!token) {
      alert("Sessão expirada ou não autenticada. Faça login novamente.");
      window.location.href = "/";
      return null;
    }
    return token;
  }

  function abrirModalPasta(nome = "", id = null) {
    const modal = document.getElementById("modal-nova-pasta");
    const inputNome = document.getElementById("input-nome-pasta");
    const titulo = document.getElementById("titulo-modal-pasta");
    const btnConfirmar = document.getElementById("btn-confirmar-modal-pasta");

    if (!modal || !inputNome || !titulo || !btnConfirmar) return;

    pastaEmEdicaoId = id;
    titulo.innerText = id ? "Renomear Pasta" : pastaAtivaId ? "Criar Subpasta" : "Criar Nova Pasta";
    btnConfirmar.innerText = id ? "Salvar" : "Criar";
    inputNome.value = nome;
    modal.classList.remove("hidden");
    inputNome.focus();
  }

  async function carregarPastas() {
    const container = document.getElementById("lista-pastas");
    if (!container) return;

    const token = obterToken();
    if (!token) return;

    const API_URL = import.meta.env.PUBLIC_API_URL || "http://localhost:3000";

    try {
      const resposta = await fetch(`${API_URL}/api/pastas`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const dados = await resposta.json();

      if (dados.sucesso && dados.pastas.length > 0) {
        container.innerHTML = '<div class="space-y-1" id="gavetas-wrapper"></div>';
        const wrapper = document.getElementById("gavetas-wrapper");
        if (!wrapper) return;

        const pastasPorPai = dados.pastas.reduce((grupos, pasta) => {
          const chave = pasta.pai_id ?? "raiz";
          (grupos[chave] ??= []).push(pasta);
          return grupos;
        }, {});

        const renderizarPastas = (paiId = "raiz") => (pastasPorPai[paiId] || []).map((pasta) => {
          const idSeguro = escaparHtml(pasta.id);
          const nomeSeguro = escaparHtml(pasta.nome);
          return `
          <details class="group relative">
            <summary data-id="${idSeguro}" class="pasta-item flex items-center justify-between p-1.5 rounded hover:bg-zinc-800/50 cursor-pointer list-none text-zinc-400 transition-colors">
              <div class="flex items-center gap-1.5 pointer-events-none">
                <svg class="w-4 h-4 transition-transform group-open:rotate-90" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg>
                <span class="truncate max-w-[130px]" title="${nomeSeguro}">${nomeSeguro}</span>
              </div>
              <div class="hidden group-hover:flex items-center gap-1 pr-1">
                <button data-id="${idSeguro}" data-nome="${nomeSeguro}" class="btn-editar-pasta p-1 hover:text-blue-400 transition-colors" title="Renomear">
                  <svg class="w-3.5 h-3.5 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
                </button>
                <button data-id="${idSeguro}" class="btn-deletar-pasta p-1 hover:text-red-500 transition-colors" title="Excluir">
                  <svg class="w-3.5 h-3.5 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1v3M4 7h16"></path></svg>
                </button>
              </div>
            </summary>
            <div class="pl-4 ml-1.5 border-l border-zinc-800 mt-1 space-y-1">
              ${renderizarPastas(pasta.id).join("")}
              <div id="notas-pasta-${idSeguro}" class="space-y-1 text-sm text-zinc-400">
                <p class="text-xs text-zinc-600 italic">Sem notas...</p>
              </div>
            </div>
          </details>
          `;
        });

        wrapper.innerHTML = renderizarPastas().join("");
      } else {
        container.innerHTML = `
          <div class="text-center text-zinc-600 mt-10 flex flex-col items-center">
            <svg class="w-12 h-12 mb-3 text-zinc-700" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"></path></svg>
            <p>Seu cofre está vazio.</p>
            <p class="text-xs mt-1">Crie uma nova pasta ou nota.</p>
          </div>
        `;
      }
    } catch (erro) {
      container.innerHTML = '<p class="text-red-500 text-center mt-5">Erro de conexão com o banco.</p>';
    }
  }

  async function carregarNotas(idDaPasta) {
    const containerNotas = document.getElementById(`notas-pasta-${idDaPasta}`);
    if (!containerNotas) return;

    containerNotas.innerHTML = '<p class="text-xs text-zinc-600 animate-pulse">Carregando...</p>';
    const token = obterToken();
    if (!token) return;
    const API_URL = import.meta.env.PUBLIC_API_URL || "http://localhost:3000";

    try {
      const resposta = await fetch(`${API_URL}/api/notas/pasta/${idDaPasta}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const dados = await resposta.json();

      if (dados.sucesso && dados.notas.length > 0) {
        containerNotas.innerHTML = "";
        listaNotasAtual = dados.notas;
          dados.notas.forEach((nota) => {
            const tituloSeguro = escaparHtml(nota.titulo);
            const idSeguro = escaparHtml(nota.id);
          containerNotas.innerHTML += `
            <div data-id="${idSeguro}" class="nota-item p-1.5 rounded hover:bg-zinc-800/80 cursor-pointer flex items-center justify-between group/nota transition-colors">
              <span class="truncate">${tituloSeguro}</span>
              <div class="hidden group-hover/nota:flex items-center gap-1">
                <button data-id="${idSeguro}" class="btn-editar-nota p-1 hover:text-blue-400 transition-colors" title="Editar Nota">
                  <svg class="w-3.5 h-3.5 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
                </button>
                <button data-id="${idSeguro}" class="btn-deletar-nota p-1 hover:text-red-500 transition-colors" title="Excluir Nota">
                  <svg class="w-3.5 h-3.5 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 01-1 1v3M4 7h16"></path></svg>
                </button>
              </div>
            </div>
          `;
        });
      } else {
        listaNotasAtual = [];
        containerNotas.innerHTML = '<p class="text-xs text-zinc-600 italic">Sem notas...</p>';
      }
    } catch (erro) {
      containerNotas.innerHTML = '<p class="text-xs text-red-500">Erro ao carregar.</p>';
    }
  }

  function configurarBotoes() {
    if (botoesGlobaisConfigurados) return;

    document.addEventListener("click", (evento) => {
      const alvo = evento.target instanceof Element ? evento.target : null;
      if (!alvo) return;

      const btnNovaNota = alvo.closest("#btn-nova-nota");
      if (btnNovaNota) {
        if (!pastaAtivaId) {
          alert("Por favor, selecione uma pasta clicando nela antes de criar uma nota.");
          return;
        }
        const modal = document.getElementById("modal-nova-nota");
        const inputTitulo = document.getElementById("input-titulo-nota");
        if (modal && inputTitulo) {
          modal.classList.remove("hidden");
          inputTitulo.value = "";
          inputTitulo.focus();
        }
        return;
      }

      if (alvo.closest("#btn-nova-pasta")) {
        abrirModalPasta();
      }
    }, listenerOptions);

    botoesGlobaisConfigurados = true;
  }

  function configurarAcoesPastas() {
    const listaPastas = document.getElementById("lista-pastas");
    if (!listaPastas || listaPastas.dataset.ativoAcoes) return;

    listaPastas.addEventListener("click", async (evento) => {
      const alvo = evento.target instanceof Element ? evento.target : null;
      if (!alvo) return;

      const btnDeletar = alvo.closest(".btn-deletar-pasta");
      const btnEditar = alvo.closest(".btn-editar-pasta");
      const areaDaPasta = alvo.closest(".pasta-item");
      const token = obterToken();
      if (!token) return;
      const API_URL = import.meta.env.PUBLIC_API_URL || "http://localhost:3000";

      if (btnDeletar) {
        evento.preventDefault();
        const idPasta = btnDeletar.dataset.id;
        if (!confirm("Tem certeza que deseja excluir esta pasta e todas as notas dentro dela?")) return;
        try {
          const resposta = await fetch(`${API_URL}/api/pastas/${idPasta}`, {
            method: "DELETE",
            headers: { Authorization: `Bearer ${token}` },
          });
          if (resposta.ok) carregarPastas();
          else alert("Erro ao deletar a pasta.");
        } catch (erro) {
          alert("Servidor offline.");
        }
        return;
      }

      if (btnEditar) {
        evento.preventDefault();
        abrirModalPasta(btnEditar.dataset.nome, btnEditar.dataset.id);
        return;
      }

      if (areaDaPasta) {
        pastaAtivaId = areaDaPasta.dataset.id;
        document.querySelectorAll(".pasta-item").forEach((el) => {
          el.classList.remove("text-zinc-100", "bg-zinc-800/80");
          el.classList.add("text-zinc-400");
        });
        areaDaPasta.classList.remove("text-zinc-400");
        areaDaPasta.classList.add("text-zinc-100", "bg-zinc-800/80");
        carregarNotas(pastaAtivaId);
      }
    }, listenerOptions);
    listaPastas.dataset.ativoAcoes = "1";
  }

  function abrirNota(notaClicada) {
    notaAtivaId = notaClicada.dataset.id;
    const dadosDaNota = listaNotasAtual.find((nota) => nota.id == notaAtivaId);
    if (!dadosDaNota) return;

    document.getElementById("tela-vazia")?.classList.add("hidden");
    document.getElementById("tela-vazia")?.classList.remove("flex");
    document.getElementById("tela-editor")?.classList.remove("hidden");
    document.getElementById("tela-editor")?.classList.add("flex");
    document.getElementById("editor-titulo").value = dadosDaNota.titulo;
    document.getElementById("editor-conteudo").value = dadosDaNota.conteudo || "";
  }

  function configurarEditor() {
    const listaPastas = document.getElementById("lista-pastas");
    if (listaPastas && !listaPastas.dataset.ativoEditor) {
      listaPastas.addEventListener("click", async (evento) => {
        const alvo = evento.target instanceof Element ? evento.target : null;
        if (!alvo) return;

        const btnDeletarNota = alvo.closest(".btn-deletar-nota");
        const btnEditarNota = alvo.closest(".btn-editar-nota");
        const notaClicada = alvo.closest(".nota-item");

        if (btnDeletarNota) {
          evento.preventDefault();
          evento.stopPropagation();
          if (!confirm("Tem certeza que deseja excluir esta nota?")) return;
          const token = obterToken();
          if (!token) return;
          try {
            const API_URL = import.meta.env.PUBLIC_API_URL || "http://localhost:3000";
            const resposta = await fetch(`${API_URL}/api/notas/${btnDeletarNota.dataset.id}`, {
              method: "DELETE",
              headers: { Authorization: `Bearer ${token}` },
            });
            if (resposta.ok) {
              if (notaAtivaId == btnDeletarNota.dataset.id) {
                notaAtivaId = null;
                document.getElementById("tela-editor")?.classList.add("hidden");
                document.getElementById("tela-editor")?.classList.remove("flex");
                document.getElementById("tela-vazia")?.classList.remove("hidden");
                document.getElementById("tela-vazia")?.classList.add("flex");
              }
              carregarNotas(pastaAtivaId);
            } else alert("Erro ao deletar a nota.");
          } catch (erro) {
            alert("Servidor offline.");
          }
          return;
        }

        if (btnEditarNota) evento.preventDefault();
        if (notaClicada) abrirNota(notaClicada);
      }, listenerOptions);
      listaPastas.dataset.ativoEditor = "1";
    }

    const btnSalvar = document.getElementById("btn-salvar-nota");
    if (!btnSalvar || btnSalvar.dataset.ativo) return;
    btnSalvar.addEventListener("click", async () => {
      if (!notaAtivaId) return;
      const titulo = document.getElementById("editor-titulo").value;
      const conteudo = document.getElementById("editor-conteudo").value;
      const textoBtn = document.getElementById("texto-btn-salvar");
      const token = obterToken();
      if (!token || !textoBtn) return;
      textoBtn.innerText = "Salvando...";

      try {
        const API_URL = import.meta.env.PUBLIC_API_URL || "http://localhost:3000";
        const resposta = await fetch(`${API_URL}/api/notas/${notaAtivaId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ titulo, conteudo }),
        });
        if (resposta.ok) {
          textoBtn.innerText = "Salvo!";
          setTimeout(() => { textoBtn.innerText = "Salvar"; }, 2000);
          carregarNotas(pastaAtivaId);
        } else {
          alert("Erro ao salvar a nota.");
          textoBtn.innerText = "Salvar";
        }
      } catch (erro) {
        alert("Erro de conexão com o servidor.");
        textoBtn.innerText = "Salvar";
      }
    }, listenerOptions);
    btnSalvar.dataset.ativo = "1";
  }

  function configurarModalNovaNota() {
    const modal = document.getElementById("modal-nova-nota");
    const inputTitulo = document.getElementById("input-titulo-nota");
    if (!modal || !inputTitulo || modal.dataset.ativo) return;
    const btnCancelar = document.getElementById("btn-cancelar-modal");
    const btnFechar = document.getElementById("btn-fechar-x");
    const btnConfirmar = document.getElementById("btn-confirmar-modal");
    const fecharModal = () => modal.classList.add("hidden");

    const processarCriacao = async () => {
      const nomeNota = inputTitulo.value.trim();
      const token = obterToken();
      if (!nomeNota || nomeNota.length > 200 || !token || !pastaAtivaId) return;
      btnConfirmar.innerText = "Criando...";
      try {
        const API_URL = import.meta.env.PUBLIC_API_URL || "http://localhost:3000";
        const resposta = await fetch(`${API_URL}/api/notas`, {
          method: "POST",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
          body: JSON.stringify({ titulo: nomeNota, pasta_id: pastaAtivaId }),
        });
        if (resposta.ok) {
          fecharModal();
          carregarNotas(pastaAtivaId);
        } else alert("Erro ao criar a nota no servidor.");
      } catch (erro) {
        alert("O servidor backend Node.js está offline.");
      } finally {
        btnConfirmar.innerText = "Criar Nota";
      }
    };
    btnCancelar?.addEventListener("click", fecharModal, listenerOptions);
    btnFechar?.addEventListener("click", fecharModal, listenerOptions);
    btnConfirmar?.addEventListener("click", processarCriacao, listenerOptions);
    inputTitulo.addEventListener("keydown", (evento) => {
      if (evento.key === "Enter") processarCriacao();
      if (evento.key === "Escape") fecharModal();
    }, listenerOptions);
    modal.dataset.ativo = "1";
  }

  function configurarModalNovaPasta() {
    const modal = document.getElementById("modal-nova-pasta");
    const inputNome = document.getElementById("input-nome-pasta");
    if (!modal || !inputNome || modal.dataset.ativo) return;
    const btnCancelar = document.getElementById("btn-cancelar-modal-pasta");
    const btnFechar = document.getElementById("btn-fechar-modal-pasta");
    const btnConfirmar = document.getElementById("btn-confirmar-modal-pasta");
    const fecharModal = () => modal.classList.add("hidden");

    const processarCriacao = async () => {
      const nomePasta = inputNome.value.trim();
      const token = obterToken();
      if (!nomePasta || nomePasta.length > 120 || !token) return;
      btnConfirmar.innerText = pastaEmEdicaoId ? "Salvando..." : "Criando...";
      const API_URL = import.meta.env.PUBLIC_API_URL || "http://localhost:3000";
      const endpoint = pastaEmEdicaoId ? `${API_URL}/api/pastas/${pastaEmEdicaoId}` : `${API_URL}/api/pastas`;
      try {
        const resposta = await fetch(endpoint, {
          method: pastaEmEdicaoId ? "PUT" : "POST",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
          body: JSON.stringify({ nome: nomePasta, pai_id: pastaEmEdicaoId ? null : pastaAtivaId }),
        });
        if (resposta.ok) {
          fecharModal();
          carregarPastas();
        } else {
          alert(pastaEmEdicaoId ? "Erro ao renomear a pasta." : "Erro ao criar a pasta no servidor.");
        }
      } catch (erro) {
        alert("O servidor backend Node.js está offline.");
      } finally {
        pastaEmEdicaoId = null;
        btnConfirmar.innerText = "Criar";
      }
    };
    btnCancelar?.addEventListener("click", fecharModal, listenerOptions);
    btnFechar?.addEventListener("click", fecharModal, listenerOptions);
    btnConfirmar?.addEventListener("click", processarCriacao, listenerOptions);
    inputNome.addEventListener("keydown", (evento) => {
      if (evento.key === "Enter") processarCriacao();
      if (evento.key === "Escape") fecharModal();
    }, listenerOptions);
    modal.dataset.ativo = "1";
  }

  carregarPastas();
  configurarBotoes();
  configurarAcoesPastas();
  configurarEditor();
  configurarModalNovaNota();
  configurarModalNovaPasta();
}