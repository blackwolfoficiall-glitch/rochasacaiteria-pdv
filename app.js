// URL do backend no Render
const BACKEND = "https://rochasa-backend.onrender.com"

document.addEventListener("DOMContentLoaded", () => {
const weightEl = document.getElementById("weight");
const totalEl = document.getElementById("total");
const priceInput = document.getElementById("price100");
const btnConnectScale = document.getElementById("btnConnectScale");
const btnCharge = document.getElementById("btnCharge");

const btnConfig = document.getElementById("btnConfig");
const btnReport = document.getElementById("btnReport");

const payModal = document.getElementById("payModal");
const closeModal = document.getElementById("closeModal");
const optDebit = document.getElementById("optDebit");
const optCredit = document.getElementById("optCredit");
const optPix = document.getElementById("optPix");
const cancelPay = document.getElementById("cancelPay");
const toastEl = document.getElementById("toast");

let currentGrams = 0;
let scaleConnected = false;

// ============================================================
// 🔵 CARREGAR CONFIGURAÇÕES SALVAS (preço + nome unidade)
// ============================================================
const savedPrice = localStorage.getItem("preco100");
const savedUnit = localStorage.getItem("unidadeNome");

// Aplica preço salvo no input
if (savedPrice && priceInput) {
priceInput.value = savedPrice;
}

// Aplica nome da unidade no título
if (savedUnit) {
const titleEl = document.getElementById("unitName");
if (titleEl) titleEl.textContent = savedUnit;
}

// Calcula total já com o preço salvo
setTimeout(() => updateTotal(), 200);

// ============================================================
// TOAST
// ============================================================
function showToast(message, isError = false) {
if (!toastEl) return;
toastEl.textContent = message;
toastEl.classList.remove("hidden");
toastEl.classList.toggle("error", !!isError);

setTimeout(() => {
toastEl.classList.add("hidden");
toastEl.classList.remove("error");
}, 3000);
}

// ============================================================
// CÁLCULO DO TOTAL
// ============================================================
function parsePrice100() {
if (!priceInput) return 0;
const raw = priceInput.value.replace(".", "").replace(",", ".");
const v = parseFloat(raw);
return isNaN(v) ? 0 : v;
}

function updateTotal() {
const price100 = parsePrice100();
const total = (currentGrams / 100) * price100;

totalEl.textContent = total.toLocaleString("pt-BR", {
style: "currency",
currency: "BRL"
});
}

// ============================================================
// SIMULAÇÃO DE BALANÇA
// ============================================================
function startFakeScale() {
if (scaleConnected) return;
scaleConnected = true;
showToast("Balança conectada (modo demonstração)");

if (btnConnectScale) {
btnConnectScale.style.display = "none" // Esconde botão
}

setInterval(() => {
currentGrams = Math.floor(50 + Math.random() * 850);
weightEl.textContent = `${currentGrams} g`;
updateTotal();
}, 2000);
}

// ============================================================
// MODAL DE PAGAMENTO
// ============================================================
function openPaymentModal() {
payModal.classList.remove("hidden");
}

function closePaymentModal() {
payModal.classList.add("hidden");
}

// ============================================================
// PAGAMENTO
// ============================================================
async function createPayment(method) {
const price100 = parsePrice100();

if (currentGrams <= 0 || price100 <= 0) {
showToast("Peso ou preço inválido", true);
return;
}

const total = (currentGrams / 100) * price100;

try {
showToast("Enviando pagamento...");

const resp = await fetch(`${BACKEND}/create_payment?method=${encodeURIComponent(method)}`, {
method: "POST",
headers: { "Content-Type": "application/json" },
body: JSON.stringify({
amount: Number(total.toFixed(2)),
description: "Pedido PDV Rochas Açaí"
})
});

if (!resp.ok) {
showToast("Erro ao criar pagamento", true);
return;
}

const data = await resp.json();

if (method === "pix") {
showToast("PIX criado. Veja o QR Code na maquininha.");
} else {
showToast("Pagamento criado. Conclua na maquininha.");
}

closePaymentModal();
} catch (err) {
console.error(err);
showToast("Erro de conexão com servidor", true);
}
}

// ============================================================
// SENHA (Config e Relatório)
// ============================================================
function askPasswordAndGo(path) {
const pass = prompt("Digite a senha (1901):");
if (pass === "1901") {
window.location.href = path;
} else if (pass !== null) {
showToast("Senha incorreta", true);
}
}

// ============================================================
// EVENTOS
// ============================================================

// Conectar balança
if (btnConnectScale) {
btnConnectScale.addEventListener("click", startFakeScale);
}

// Atualizar total ao mudar preço
if (priceInput) {
priceInput.addEventListener("input", updateTotal);
}

// Botão COBRAR
if (btnCharge) {
btnCharge.addEventListener("click", () => {
if (currentGrams <= 0) {
showToast("Coloque o produto na balança", true);
return;
}
openPaymentModal();
});
}

// Modal
if (closeModal) closeModal.addEventListener("click", closePaymentModal);
if (cancelPay) cancelPay.addEventListener("click", closePaymentModal);

if (optDebit) optDebit.addEventListener("click", () => createPayment("debit"));
if (optCredit) optCredit.addEventListener("click", () => createPayment("credit"));
if (optPix) optPix.addEventListener("click", () => createPayment("pix"));

// Config e Relatório
if (btnConfig) btnConfig.addEventListener("click", () => askPasswordAndGo("config.html"));
if (btnReport) btnReport.addEventListener("click", () => askPasswordAndGo("relatorio.html"));
});
