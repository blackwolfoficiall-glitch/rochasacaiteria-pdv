
console.log('PDV WebApp iniciado');
console.log("PDV WebApp iniciado");

// Preço por kg
const precoPorKg = 64.90;

// Atualiza o peso e total
function atualizarValores(pesoKg) {
    document.getElementById("peso").innerText = pesoKg.toFixed(3) + " kg";
    const total = pesoKg * precoPorKg;
    document.getElementById("total").innerText = "R$ " + total.toFixed(2);
}

// Exemplo de simulação de peso — depois podemos integrar com balança real
let pesoAtual = 0;

// Simula peso aumentando
setInterval(() => {
    pesoAtual += 0.010; // 10 gramas
    if (pesoAtual > 1.000) pesoAtual = 0;
    atualizarValores(pesoAtual);
}, 500);
