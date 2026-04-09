import { addTask, getTasks, deleteTask } from "./api/tasks.js";
import { getCookie } from "./front/helper.js";

const openModal = document.querySelector('#openModal');

export function toggleTask(id) {
  const tarefa = tarefas.find(t => t.id === id);

  tarefa.isConcluded = !tarefa.isConcluded;

  render();
}

export function toggleFinalizadas() {
  const lista = document.getElementById('finalizadas');
  const arrow = document.getElementById('arrowIcon');

  lista.classList.toggle('hidden');
  arrow.classList.toggle('rotate-90');
}

export function abrirModal() {
  openModal.addEventListener('click', () => {
    const modal = document.getElementById('modal');

    modal.classList.remove('hidden');
    modal.classList.add('flex');
  })
}

export function fecharModal() {
  const modal = document.getElementById('modal');

  modal.classList.add('hidden');
  modal.classList.remove('flex');
}

let tarefas = [];
let filtroPesquisa = "";
let filtroPrioridade = "ALL";

export function render() {
  const listaTarefas = document.getElementById('tarefas');
  const listaFinalizadas = document.getElementById('finalizadas');
  const countFinalizadas = document.getElementById('countFinalizadas');

  listaTarefas.innerHTML = "";
  listaFinalizadas.innerHTML = "";

  const tarefasFiltradas = tarefas.filter(tarefa => {
    const matchPesquisa = tarefa.title.toLowerCase().includes(filtroPesquisa.toLowerCase()) || 
                         (tarefa.content && tarefa.content.toLowerCase().includes(filtroPesquisa.toLowerCase()));
    const matchPrioridade = filtroPrioridade === "ALL" || tarefa.priority === filtroPrioridade;
    return matchPesquisa && matchPrioridade;
  });

  let finalizadasCount = 0;

  tarefasFiltradas.forEach(tarefa => {

    let cor = "";
    if (tarefa.priority === "HIGH") {
      cor = "bg-red-100 text-red-500";
    } else if (tarefa.priority === "MEDIUM") {
      cor = "bg-yellow-100 text-yellow-600";
    } else {
      cor = "bg-green-100 text-green-500";
    }

    const priorityLabel = {
      "HIGH": "Alta",
      "MEDIUM": "Média",
      "LOW": "Baixa"
    }[tarefa.priority] || tarefa.priority;

    const html = `
  <div class="task bg-white p-4 rounded-lg border">
    <div class="flex items-start gap-3">

      <input type="checkbox" ${tarefa.isConcluded ? "checked" : ""} 
        onchange="toggleTask(${tarefa.id})" class="mt-1">

      <div class="flex-1">

        <div class="flex items-center gap-2">
          <p class="titulo text-sm font-medium ${tarefa.isConcluded ? "line-through text-gray-500" : "text-gray-800"}">
            ${tarefa.title}
          </p>

          <span class="${cor} text-xs px-2 py-0.5 rounded-full">
            ${priorityLabel}
          </span>
        </div>

        <p class="text-gray-500 text-xs mt-1">
          ${tarefa.content}
        </p>

        <p class="text-xs text-gray-400 mt-2">
          ${formatarData(tarefa.data)}
        </p>

        <p onclick="excluir(${tarefa.id})" class="text-xs text-red-400 mt-2 cursor-pointer">
          Excluir
        </p>

      </div>
    </div>
  </div>
`;

    if (tarefa.isConcluded) {
      finalizadasCount++;
      listaFinalizadas.innerHTML += html;
    } else {
      listaTarefas.innerHTML += html;
    }
  });

  if (countFinalizadas) {
    countFinalizadas.innerText = finalizadasCount;
  }
}

export function adicionarTarefa() {
  const titulo = document.getElementById('tituloInput').value.trim();
  const conteudo = document.getElementById('conteudoInput').value.trim();
  const prioridade = document.getElementById('prioridadeInput').value;


  if (!titulo) {
    alert("Digite um título!");
    return;
  }

  const novaTarefa = {
    title: titulo,
    content: conteudo,
    priority: prioridade,
    isConcluded: false
  };

  addTask(novaTarefa).then(usuarioSalvo => {
    if (usuarioSalvo && usuarioSalvo.tasks) {
      tarefas = usuarioSalvo.tasks;
    } else if (Array.isArray(usuarioSalvo)) {
      tarefas = usuarioSalvo;
    }

    render();

    document.getElementById('tituloInput').value = "";
    document.getElementById('conteudoInput').value = "";
    document.getElementById('prioridadeInput').value = "Alta";
    fecharModal();
  }).catch(err => {
    console.error("Erro detalhado:", err);
    alert("Erro ao adicionar tarefa (verifique o console): " + err.message);
  });
}

export async function carregarTarefas() {
  const userId = getCookie('current_user_id');
  if (!userId) {
    console.warn("Usuário não logado. Redirecionando...");
    return;
  }

  try {
    const data = await getTasks(userId);
    if (data && data.tasks) {
      tarefas = data.tasks;
    } else if (Array.isArray(data)) {
      tarefas = data;
    }
    render();
  } catch (error) {
    console.error("Erro ao carregar tarefas:", error);
  }
}

export function excluir(id) {
  const userId = getCookie('current_user_id');
  tarefas = tarefas.filter(t => t.id !== id);
  deleteTask(userId, id);
  render();
}

export function formatarData(data) {
  if (!data) return "";

  const [ano, mes, dia] = data.split("-");
  return `${dia}/${mes}/${ano}`;
}

export function abrirChat() {
  const chat = document.getElementById('chat');
  chat.classList.remove('hidden');
  chat.classList.add('flex');
}

export function fecharChat() {
  const chat = document.getElementById('chat');
  chat.classList.add('hidden');
  chat.classList.remove('flex');
}

export function filtrar(termo) {
  filtroPesquisa = termo;
  render();
}

export function filtrarPrioridade(prio) {
  filtroPrioridade = prio;

  // Atualizar estilos dos botões de filtro
  const botoes = ['ALL', 'HIGH', 'MEDIUM', 'LOW'];
  botoes.forEach(b => {
    const btn = document.getElementById(`filter-${b}`);
    if (btn) {
      if (b === prio) {
        btn.classList.add('bg-[#25937D]', 'text-white');
        btn.classList.remove('bg-gray-200', 'text-gray-600');
      } else {
        btn.classList.remove('bg-[#25937D]', 'text-white');
        btn.classList.add('bg-gray-200', 'text-gray-600');
      }
    }
  });

  render();
}

window.toggleTask = toggleTask;
window.toggleFinalizadas = toggleFinalizadas;
window.abrirModal = abrirModal;
window.fecharModal = fecharModal;
window.adicionarTarefa = adicionarTarefa;
window.excluir = excluir;
window.abrirChat = abrirChat;
window.fecharChat = fecharChat;
window.formatarData = formatarData;
window.carregarTarefas = carregarTarefas;
window.filtrar = filtrar;
window.filtrarPrioridade = filtrarPrioridade;

abrirModal();
carregarTarefas();
