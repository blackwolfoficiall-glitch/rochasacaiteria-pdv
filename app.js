// ===== CONFIGURAÇÕES =====
let precoPor100g = localStorage.getItem("preco") ? Number(localStorage.getItem("preco")) : 5.49;
let unidadeNome = localStorage.getItem("unidade") || "Unidade Ilha 9";

// Atualiza o texto da unidade
document.getElementById("unidade").innerText = unidadeNome;


// ===== FUNÇÃO PARA ATUALIZAR TELA =====
function atualizarDisplay(pesoKg) {

    let total = pesoKg * (precoPor100g * 10); // 100g → multiplicador *10

    document.getElementById("pesoDisplay").innerText = pesoKg.toFixed(3) + " kg";
    document.getElementById("totalDisplay").innerText = "R$ " + total.toFixed(2);
    document.getElementById("precoInfo").innerText = "R$ " + precoPor100g.toFixed(2) + " / 100g";
}


// ===== SIMULAÇÃO DE PESAGEM (VAI SER BALANÇA DEPOIS) =====
// Altere aqui somente para testar
setInterval(() => {
    let pesoFake = Math.random() * 0.800; // até 800g
    atualizarDisplay(pesoFake);
}, 1500);


// ===== BOTÃO COBRAR =====
document.querySelector(".btn-cobrar").addEventListener("click", () => {
    alert("Iniciando pagamento… (integração depois)");
});
