function toggleTask(id) {
  const tarefa = tarefas.find(t => t.id === id);

  tarefa.concluida = !tarefa.concluida;

  render();
}

function toggleFinalizadas() {
  const lista = document.getElementById('finalizadas');
  const arrow = document.getElementById('arrowIcon');

  lista.classList.toggle('hidden');
  arrow.classList.toggle('rotate-90');
}

function abrirModal() {
  const modal = document.getElementById('modal');

  modal.classList.remove('hidden');
  modal.classList.add('flex');
}

function fecharModal() {
  const modal = document.getElementById('modal');

  modal.classList.add('hidden');
  modal.classList.remove('flex');
}

let tarefas = [
  // {
  //   id: 1,
  //   titulo: "Revisar documentação da API",
  //   conteudo: "Atualizar endpoints...",
  //   prioridade: "Média",
  //   data: "2026-03-25",
  //   concluida: false
  // }
];

function render() {
  const listaTarefas = document.getElementById('tarefas');
  const listaFinalizadas = document.getElementById('finalizadas');

  listaTarefas.innerHTML = "";
  listaFinalizadas.innerHTML = "";

  tarefas.forEach(tarefa => {

    let cor = "";
    if (tarefa.prioridade === "Alta") {
      cor = "bg-red-100 text-red-500";
    } else if (tarefa.prioridade === "Média") {
      cor = "bg-yellow-100 text-yellow-600";
    } else {
      cor = "bg-green-100 text-green-500";
    }

    const html = `
  <div class="task bg-white p-4 rounded-lg border">
    <div class="flex items-start gap-3">

      <input type="checkbox" ${tarefa.concluida ? "checked" : ""} 
        onchange="toggleTask(${tarefa.id})" class="mt-1">

      <div class="flex-1">

        <div class="flex items-center gap-2">
          <p class="titulo text-sm font-medium ${tarefa.concluida ? "line-through text-gray-500" : "text-gray-800"}">
            ${tarefa.titulo}
          </p>

          <span class="${cor} text-xs px-2 py-0.5 rounded-full">
            ${tarefa.prioridade}
          </span>
        </div>

        <p class="text-gray-500 text-xs mt-1">
          ${tarefa.conteudo}
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

    if (tarefa.concluida) {
      listaFinalizadas.innerHTML += html;
    } else {
      listaTarefas.innerHTML += html;
    }
  });
}

function adicionarTarefa() {
  const titulo = document.getElementById('tituloInput').value.trim();
  const conteudo = document.getElementById('conteudoInput').value.trim();
  const prioridade = document.getElementById('prioridadeInput').value;
  const data = document.getElementById('dataInput').value;


  if (!titulo) {
    alert("Digite um título!");
    return;
  }

  const novaTarefa = {
    id: Date.now(),
    titulo: titulo,
    conteudo: conteudo,
    prioridade: prioridade,
    data: data,
    concluida: false
  };

  tarefas.push(novaTarefa);
  render();
  document.getElementById('tituloInput').value = "";
  document.getElementById('conteudoInput').value = "";
  document.getElementById('prioridadeInput').value = "Alta";
  document.getElementById('dataInput').value = "";
  fecharModal();
}

function excluir(id) {
  tarefas = tarefas.filter(t => t.id !== id);
  render();
}

function formatarData(data) {
  if (!data) return "";

  const [ano, mes, dia] = data.split("-");
  return `${dia}/${mes}/${ano}`;
}

function abrirChat() {
  const chat = document.getElementById('chat');
  chat.classList.remove('hidden');
  chat.classList.add('flex');
}

function fecharChat() {
  const chat = document.getElementById('chat');
  chat.classList.add('hidden');
  chat.classList.remove('flex');
}

