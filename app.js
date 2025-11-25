// URL do backend
const BACKEND = "https://rochasa-backend.onrender.com"

document.addEventListener("DOMContentLoaded", () => {

const weightEl = document.getElementById("weight");
const totalEl = document.getElementById("total");
const priceInput = document.getElementById("price100");
const unitNameEl = document.getElementById("unitName");

const btnConnectScale = document.getElementById("btnConnectScale");
const btnCharge = document.getElementById("btnCharge");
const btnConfig = document.getElementById("btnConfig");
const btnReport = document.getElementById("btnReport");

const payModal = document.getElementById("payModal");
const closeModal = document.getElementById("closeModal");
const cancelPay = document.getElementById("cancelPay");

const optDebit = document.getElementById("optDebit");
const optCredit = document.getElementById("optCredit");
const optPix = document.getElementById("optPix");

const toastEl = document.getElementById("toast");
const qrWrap = document.getElementById("qrWrap");

let currentGrams = 0;
let scaleConnected = false;

// ============ CARREGAR CONFIG ============

const savedPrice = localStorage.getItem("preco100");
if (savedPrice && priceInput) {
priceInput.value = savedPrice;
}

// pegar o elemento do nome da unidade
const unitNameEl = document.getElementById("unitName");

// pegar nome salvo no localStorage
const savedUnit = localStorage.getItem("unidadeNome");

// aplicar no topo
if (savedUnit && unitNameEl) {
unitNameEl.textContent = savedUnit;
}

// recalcula o total com atraso para garantir renderização
setTimeout(updateTotal, 150);

// ============= FUNÇÕES =============
function showToast(msg, error=false){
toastEl.textContent = msg;
toastEl.classList.remove("hidden");
toastEl.style.background = error ? "#b00000" : "#222"
setTimeout(() => toastEl.classList.add("hidden"), 2800);
}

function parsePrice(){
return parseFloat(priceInput.value.replace(",","."));
}

function updateTotal(){
const price = parsePrice();
const result = (currentGrams / 100) * price;

totalEl.textContent = result.toLocaleString("pt-BR", {
style:"currency", currency:"BRL"
});
}

// ============= BALANÇA FAKE =============
function startFakeScale(){
if (scaleConnected) return;

scaleConnected = true;
btnConnectScale.style.display = "none"
showToast("Balança conectada (demonstração)");

setInterval(() => {
currentGrams = Math.floor(50 + Math.random()*850);
weightEl.textContent = currentGrams + " g"
updateTotal();
}, 2000);
}

// ============= PAGAMENTO =============
async function createPayment(method){
const price = parsePrice();
if (currentGrams <= 0 || price <= 0){
showToast("Peso ou preço inválido", true);
return;
}

const total = (currentGrams / 100) * price;

try {
showToast("Enviando pagamento...");

const res = await fetch(`${BACKEND}/create_payment?method=${method}`, {
method: "POST",
headers:{ "Content-Type":"application/json" },
body: JSON.stringify({
amount: Number(total.toFixed(2)),
description: "Pedido PDV"
})
});

if (!res.ok){
showToast("Erro ao criar pagamento", true);
return;
}

const data = await res.json();

if (method === "pix"){
showToast("PIX gerado — veja a maquininha.");
} else {
showToast("Pagamento criado — finalize na maquininha.");
}

payModal.classList.add("hidden");

} catch (e){
showToast("Falha de conexão", true);
}
}

// ============= EVENTOS =============
btnConnectScale.addEventListener("click", startFakeScale);
priceInput.addEventListener("input", updateTotal);

btnCharge.addEventListener("click", () => {
if (currentGrams <= 0){
showToast("Coloque o produto na balança", true);
return;
}
payModal.classList.remove("hidden");
});

closeModal.addEventListener("click", () => payModal.classList.add("hidden"));
cancelPay.addEventListener("click", () => payModal.classList.add("hidden"));

optDebit.addEventListener("click", () => createPayment("debit"));
optCredit.addEventListener("click", () => createPayment("credit"));
optPix.addEventListener("click", () => createPayment("pix"));

btnConfig.addEventListener("click", () => {
const pass = prompt("Digite a senha (1901):");
if (pass === "1901") window.location.href = "config.html"
else showToast("Senha incorreta", true);
});

btnReport.addEventListener("click", () => {
const pass = prompt("Digite a senha (1901):");
if (pass === "1901") window.location.href = "relatorio.html"
else showToast("Senha incorreta", true);
});

});
