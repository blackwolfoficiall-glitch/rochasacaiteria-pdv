console.log("PDV Ativado");

// carregar configuração
let preco = localStorage.getItem("preco100") || 5.49;
let unidade = localStorage.getItem("unidade") || "Ilha 9";

document.getElementById("unidade").innerText = "Unidade " + unidade;
document.getElementById("precoInfo").innerText = "R$ " + preco + " / 100g";

// simulação de peso
let peso = 0.300; // exemplo
document.getElementById("pesoDisplay").innerText = peso.toFixed(3) + " kg";

let total = peso * (preco * 10);
document.getElementById("totalDisplay").innerText = "R$ " + total.toFixed(2);
