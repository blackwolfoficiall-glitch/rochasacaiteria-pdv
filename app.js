// URL do backend no Render
const BACKEND = "https://rochasa-backend.onrender.com"

document.addEventListener("DOMContentLoaded", () => {

// ELEMENTOS
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
const unitNameEl = document.getElementById("unitName");

let currentGrams = 0;
let scaleConnected = false;

// ============================================================
// CARREGAR CONFIG SALVA
// ============================================================
const savedPrice = localStorage.getItem("preco100");
if (savedPrice && priceInput) priceInput.value = savedPrice;

const savedUnit = localStorage.getItem("unidadeNome");
if (savedUnit && unitNameEl) unitNameEl.textContent = savedUnit;

// ============================================================
// TOAST
// ============================================================
function showToast(msg, error = false) {
toastEl.textContent = msg;
toastEl.classList.remove("hidden");
toastEl.classList.toggle("error", error);

setTimeout(() => toastEl.classList.add("hidden"), 2500);
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
// BALANÇA FAKE
// ============================================================
function startFakeScale() {
if (scaleConnected) return;

scaleConnected = true;
showToast("Balança conectada (modo demonstração)");

btnConnectScale.style.display = "none"

setInterval(() => {
currentGrams = Math.floor(50 + Math.random() * 850);
weightEl.textContent = `${currentGrams} g`;
updateTotal();
}, 2000);
}

// ============================================================
// MODAL
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

const resp = await fetch(
`${BACKEND}/create_payment?method=${method}`,
{
method: "POST",
headers: { "Content-Type": "application/json" },
body: JSON.stringify({
amount: Number(total.toFixed(2)),
description: "Pedido PDV Rochas Açaí"
})
}
);

if (!resp.ok) {
showToast("Erro ao criar pagamento", true);
return;
}

const json = await resp.json();

if (method === "pix") {
showToast("PIX criado — veja o QR code na maquininha");
} else {
showToast("Pagamento criado — finalize na maquininha");
}

closePaymentModal();
} catch (err) {
console.error(err);
showToast("Erro de conexão com servidor", true);
}
}

// ============================================================
// EVENTOS
// ============================================================

if (btnConnectScale) btnConnectScale.addEventListener("click", startFakeScale);

if (priceInput) priceInput.addEventListener("input", updateTotal);

if (btnCharge) btnCharge.addEventListener("click", () => {
if (currentGrams <= 0) {
showToast("Coloque o produto na balança", true);
return;
}
openPaymentModal();
});

if (closeModal) closeModal.addEventListener("click", closePaymentModal);
if (cancelPay) cancelPay.addEventListener("click", closePaymentModal);

if (optDebit) optDebit.addEventListener("click", () => createPayment("debit"));
if (optCredit) optCredit.addEventListener("click", () => createPayment("credit"));
if (optPix) optPix.addEventListener("click", () => createPayment("pix"));

if (btnConfig) btnConfig.addEventListener("click", () => {
const pass = prompt("Digite a senha (1901):");
if (pass === "1901") window.location.href = "config.html"
else showToast("Senha incorreta", true);
});

if (btnReport) btnReport.addEventListener("click", () => {
const pass = prompt("Digite a senha (1901):");
if (pass === "1901") window.location.href = "relatorio.html"
else showToast("Senha incorreta", true);
});

});
