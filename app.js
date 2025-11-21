// ===== CONFIGURAÇÕES =====
let precoPor100g = Number(localStorage.getItem("preco") || 5.49);
let unidadeNome = localStorage.getItem("unidade") || "Ilha 9";

// Atualizar cabeçalho
document.getElementById("unidade").innerText = unidadeNome;

// Atualiza texto do preço
document.getElementById("precoInfo").innerText =
    "R$ " + precoPor100g.toFixed(2) + " / 100g";


// ===== FUNÇÃO PARA ATUALIZAR TELA =====
function atualizarDisplay(pesoKg) {

    let total = pesoKg * (precoPor100g * 10); // preço por kg

    document.getElementById("pesoDisplay").innerText = pesoKg.toFixed(3) + " kg";
    document.getElementById("totalDisplay").innerText = "R$ " + total.toFixed(2);
}


// ===== SIMULAÇÃO DE PESAGEM =====
setInterval(() => {
    let pesoFake = Math.random() * 0.800; // até 800g
    atualizarDisplay(pesoFake);
}, 1500);


// ===== BOTÃO COBRAR =====
document.querySelector(".btn-cobrar").addEventListener("click", () => {
    alert("Iniciando pagamento… (integração depois!)");
});
