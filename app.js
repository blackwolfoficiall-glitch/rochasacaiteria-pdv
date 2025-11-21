// CONFIGURAÇÕES
let precoPor100g = Number(localStorage.getItem("preco")) || 5.49;
let unidadeNome = localStorage.getItem("unidade") || "Unidade Ilha 9";

// Atualiza textos da tela
document.getElementById("unidade").innerText = unidadeNome;
document.getElementById("precoInfo").innerText = "R$ " + precoPor100g.toFixed(2) + " / 100g";

// Atualização do display
function atualizarDisplay(pesoKg) {
    let total = pesoKg * (precoPor100g * 10); // 100g = *10

    document.getElementById("pesoDisplay").innerText = pesoKg.toFixed(3) + " kg";
    document.getElementById("totalDisplay").innerText = "R$ " + total.toFixed(2);
}

// Simulação da balança (depois troca pela real)
setInterval(() => {
    let pesoFake = Math.random() * 0.800;
    atualizarDisplay(pesoFake);
}, 1500);

// BOTÃO COBRAR
document.querySelector(".btn-cobrar").addEventListener("click", () => {
    alert("Pagamento iniciado!");
});
