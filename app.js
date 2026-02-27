let telefone = "";
let peso = 0;
let valor = 0;
let avaliacao = 0;

const precoPor100g = 5.00;

function trocarTela(id) {
  document.querySelectorAll(".tela").forEach(t => t.classList.remove("ativa"));
  document.getElementById(id).classList.add("ativa");
}

function irParaPeso() {
  telefone = document.getElementById("telefone").value;
  if (!telefone) return alert("Digite o telefone");
  trocarTela("telaPeso");
}

function simularPeso() {
  peso = Math.floor(Math.random() * 800) + 200;
  document.getElementById("peso").innerText = peso + " g";
}

function irParaPagamento() {
  valor = ((peso / 100) * precoPor100g).toFixed(2);
  document.getElementById("valor").innerText = "R$ " + valor;
  trocarTela("telaPagamento");
}

function confirmarPagamento() {
  trocarTela("telaAvaliacao");
}

function avaliar(nota) {
  avaliacao = nota;
  salvarVenda();
  setTimeout(() => location.reload(), 30000);
}

function salvarVenda() {
  const vendas = JSON.parse(localStorage.getItem("vendas")) || [];

  vendas.push({
    telefone,
    peso,
    valor: Number(valor),
    avaliacao,
    data: new Date().toLocaleString("pt-BR")
  });

  localStorage.setItem("vendas", JSON.stringify(vendas));
}

/* MODO QUIOSQUE */
history.pushState(null, null, location.href);
window.onpopstate = () => history.pushState(null, null, location.href);

/* ACESSO SECRETO AO DASHBOARD */
let timer;
document.addEventListener("touchstart", () => {
  timer = setTimeout(() => {
    window.location.href = "dashboard.html";
  }, 5000);
});
document.addEventListener("touchend", () => clearTimeout(timer));
