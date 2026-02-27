let peso = 0;
let valorKg = localStorage.getItem("kg") || 49.90;
let vendas = JSON.parse(localStorage.getItem("vendas") || "[]");

document.getElementById("tituloLoja").innerText =
  localStorage.getItem("titulo") || "Rochas Açaí – Unidade Ilha 9";

function trocar(id) {
  document.querySelectorAll(".tela").forEach(t => t.classList.remove("ativa"));
  document.getElementById(id).classList.add("ativa");
}

function irPeso() { trocar("t2"); }

function simularPeso() {
  peso = Math.floor(Math.random() * 500) + 100;
  document.getElementById("peso").innerText = peso + " g";
}

function irPagamento() {
  let valor = (peso / 1000 * valorKg).toFixed(2);
  document.getElementById("valor").innerText = "R$ " + valor;
  trocar("t3");
}

function confirmarPagamento() {
  let venda = {
    id: "RA-" + Date.now(),
    telefone: document.getElementById("telefone").value,
    peso,
    valor: (peso / 1000 * valorKg).toFixed(2),
    data: new Date().toLocaleString()
  };
  vendas.push(venda);
  localStorage.setItem("vendas", JSON.stringify(vendas));
  trocar("t4");
}

function avaliar() {
  setTimeout(() => location.reload(), 2000);
}

/* CONFIG */
function abrirSenha() {
  if (prompt("Senha:") === "1951") {
    document.getElementById("modal").style.display = "flex";
  }
}

function salvarConfig() {
  localStorage.setItem("titulo", document.getElementById("confTitulo").value);
  localStorage.setItem("kg", document.getElementById("confKg").value);
  alert("Salvo!");
}

function fecharModal() {
  document.getElementById("modal").style.display = "none";
}
