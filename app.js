let pesoAtual = 0;
let precoPorGrama = 0.05; // ajuste depois (ex: 5 centavos por grama)
let timeoutReset = null;

// utilitário para trocar telas
function mostrarTela(id) {
  document.querySelectorAll(".tela").forEach(tela => {
    tela.classList.remove("ativa");
  });

  const tela = document.getElementById(id);
  if (tela) {
    tela.classList.add("ativa");
  }
}

// PASSO 1 → PASSO 2
function irParaPeso() {
  const telefone = document.getElementById("telefone").value.trim();

  if (telefone.length < 8) {
    alert("Digite um telefone válido");
    return;
  }

  mostrarTela("telaPeso");
}

// SIMULA LEITURA DA BALANÇA
function simularPeso() {
  pesoAtual = Math.floor(Math.random() * 800) + 200; // 200g a 1000g
  document.getElementById("peso").innerText = pesoAtual + " g";

  const valor = pesoAtual * precoPorGrama;
  document.getElementById("valor").innerText =
    "R$ " + valor.toFixed(2).replace(".", ",");
}

// PASSO 2 → PASSO 3
function irParaPagamento() {
  if (pesoAtual === 0) {
    alert("Coloque o pote na balança");
    return;
  }

  mostrarTela("telaPagamento");

  // segurança: se não confirmar em 30s, reseta
  timeoutReset = setTimeout(resetSistema, 30000);
}

// CONFIRMA PAGAMENTO (MANUAL)
function confirmarPagamento() {
  if (timeoutReset) clearTimeout(timeoutReset);

  mostrarTela("telaAvaliacao");

  // após 3 segundos, volta para o início
  setTimeout(resetSistema, 3000);
}

// AVALIAÇÃO
function avaliar(nota) {
  console.log("Avaliação:", nota);
}

// RESET GERAL
function resetSistema() {
  pesoAtual = 0;

  document.getElementById("telefone").value = "";
  document.getElementById("peso").innerText = "0 g";
  document.getElementById("valor").innerText = "R$ 0,00";

  mostrarTela("telaTelefone");
}

// GARANTIA DE INICIALIZAÇÃO
document.addEventListener("DOMContentLoaded", () => {
  mostrarTela("telaTelefone");
});
