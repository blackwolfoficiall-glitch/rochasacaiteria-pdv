// ===== CONFIGURAÇÃO INICIAL =====
let preco100g = localStorage.getItem("preco100g");
let unidade = localStorage.getItem("unidade");

// Se não estiver configurado, define valores padrão
if (!preco100g) {
  preco100g = 5.49;
  localStorage.setItem("preco100g", preco100g);
}

if (!unidade) {
  unidade = "Ilha 9";
  localStorage.setItem("unidade", unidade);
}

// Atualiza o texto no topo
document.getElementById("unidadeLabel").innerText = `Unidade ${unidade}`;
document.getElementById("preco100gLabel").innerText = `R$ ${preco100g} / 100g`;


// ===== FUNÇÃO PARA ATUALIZAR O PDV =====
function atualizarPDV(pesoKg) {
  const precoPorKg = preco100g * 10; // 100g * 10 = 1kg
  const total = pesoKg * precoPorKg;

  document.getElementById("pesoLabel").innerText = pesoKg.toFixed(3) + " kg";
  document.getElementById("totalLabel").innerText = "R$ " + total.toFixed(2);
}


// ===== SIMULADOR DE BALANÇA (POR ENQUANTO) =====
// Você depois conecta a balança real por USB
let pesoSimulado = 0;

setInterval(() => {
  atualizarPDV(pesoSimulado);
}, 500);


// ===== BOTÃO DE COBRAR =====
document.getElementById("btnCobrar").addEventListener("click", () => {
  alert("Pagamento iniciado! (Integração a implementar)");
});


// ===== NAVEGAÇÃO PARA CONFIGURAÇÕES =====
document.getElementById("btnConfig").addEventListener("click", () => {
  window.location.href = "config.html";
});

// ===== NAVEGAÇÃO PARA RELATÓRIO =====
document.getElementById("btnRelatorio").addEventListener("click", () => {
  window.location.href = "relatorio.html";
});
