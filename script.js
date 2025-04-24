document.addEventListener("DOMContentLoaded", function () {
  const botaoNovoAgendamento = document.querySelector(".botao-flutuante");
  const modal = document.getElementById("modal");
  const overlay = document.getElementById("modal-overlay");
  const closeModal = document.getElementById("close-modal");
  const agendamentoForm = document.getElementById("agendamento-form");
  const filtroData = document.getElementById("data"); // input de data fora do modal

  function abrirModal() {
    modal.style.display = "flex";
    overlay.style.display = "block";
    document.body.classList.add("modal-aberto");
  }

  function fecharModal() {
    modal.style.display = "none";
    overlay.style.display = "none";
    document.body.classList.remove("modal-aberto");
  }

  botaoNovoAgendamento.addEventListener("click", abrirModal);
  closeModal.addEventListener("click", fecharModal);
  overlay.addEventListener("click", fecharModal);

  agendamentoForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const tutorNome = document.getElementById("modal-tutor-nome").value;
    const petNome = document.getElementById("modal-pet-nome").value;
    const telefone = document.getElementById("modal-telefone").value;
    const servico = document.getElementById("modal-servico").value;
    const data = document.getElementById("modal-data").value;
    const hora = document.getElementById("modal-hora").value;

    if (!tutorNome || !petNome || !telefone || !servico || !data || !hora) {
      alert("Por favor, preencha todos os campos corretamente.");
      return;
    }

    adicionarAgendamento(data, hora, petNome, tutorNome, telefone, servico);
    fecharModal();
    agendamentoForm.reset();
  });

  function adicionarAgendamento(
    data,
    hora,
    petNome,
    tutorNome,
    telefone,
    servico
  ) {
    let sessao;
    const horario = parseInt(hora.split(":")[0]);

    if (horario >= 9 && horario < 12) {
      sessao = "morning";
    } else if (horario >= 13 && horario < 18) {
      sessao = "afternoon";
    } else if (horario >= 19 && horario <= 21) {
      sessao = "night";
    } else {
      alert("Horário inválido.");
      return;
    }

    const item = document.createElement("div");
    item.classList.add("item");
    item.setAttribute("data-data", data); // armazena a data para filtragem
    item.innerHTML = `
      <div class="time">${hora}</div>
      <div class="pet-info">${petNome} / <span class="name">${tutorNome}</span></div>
      <div class="service">${servico}</div>
      <div class="remove">Remover agendamento</div>
    `;

    const sessaoElement = document.querySelector(`.${sessao}`);
    sessaoElement.appendChild(item);

    item
      .querySelector(".remove")
      .addEventListener("click", () => item.remove());

    filtrarAgendamentos(); // atualiza os itens visíveis
  }

  function filtrarAgendamentos() {
    const dataSelecionada = filtroData.value;
    const agendamentos = document.querySelectorAll(".item");

    agendamentos.forEach((item) => {
      const dataItem = item.getAttribute("data-data");
      item.style.display = dataItem === dataSelecionada ? "flex" : "none";
    });
  }

  filtroData.addEventListener("change", filtrarAgendamentos);

  // Define a data atual como padrão no filtro e já filtra
  const hoje = new Date().toISOString().split("T")[0];
  if (filtroData) {
    filtroData.value = hoje;
    filtrarAgendamentos();
  }
});
