document.addEventListener("DOMContentLoaded", () => {
const priceInput = document.getElementById("inputPrice");
const nameInput = document.getElementById("inputUnit");
const btnSave = document.getElementById("btnSave");

// Carregar valores salvos
const savedPrice = localStorage.getItem("preco100");
const savedUnit = localStorage.getItem("unidadeNome");

if (savedPrice) priceInput.value = savedPrice;
if (savedUnit) nameInput.value = savedUnit;

// Salvar dados
btnSave.addEventListener("click", () => {
const price = priceInput.value || "0"
const unit = nameInput.value || "Unidade"

localStorage.setItem("preco100", price);
localStorage.setItem("unidadeNome", unit);

alert("Configurações salvas!");

// 🔥 ESSENCIAL: voltar para a tela principal
window.location.href = "index.html"
});
});
