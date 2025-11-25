/* app.js – Rochas Açaí PDV */

/* =======================
   URL DO BACKEND (Render)
========================== */
const BACKEND = "https://rochasa-backend.onrender.com";

/* =======================
   ELEMENTOS DA TELA
========================== */
const weightEl = document.getElementById("weight");
const totalEl = document.getElementById("total");
const priceInput = document.getElementById("price100");

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

const qrWrap = document.getElementById("qrWrap");
const toastEl = document.getElementById("toast");

/* =======================
   VARIÁVEIS DE ESTADO
========================== */
let currentGrams = 0;
let fakeInterval = null;

/* =======================
   FORMATAÇÃO REAL (R$)
========================== */
function formatBRL(v) {
    return v.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    });
}

/* =======================
   MOSTRAR TOAST
========================== */
function showToast(msg, error = false) {
    toastEl.textContent = msg;
    toastEl.className = "toast show " + (error ? "error" : "");

    setTimeout(() => {
        toastEl.className = "toast";
    }, 2500);
}

/* =======================
   BALANÇA FAKE
========================== */
function startFakeScale() {
    clearInterval(fakeInterval);

    fakeInterval = setInterval(() => {
        currentGrams = Math.floor(Math.random() * 450) + 50;
        weightEl.textContent = currentGrams + " g";
        updateTotal();
    }, 1200);
}

/* =======================
   PREÇO DIGITADO (CORRETO)
========================== */
function getCurrentPrice() {
    if (!priceInput) return 0;

    const raw = (priceInput.value || "0").trim();

    // "5,90" → "5.90"
    const normalized = raw
        .replace(/\./g, "")   // remove pontos
        .replace(",", ".");   // troca vírgula por ponto

    const n = Number(normalized);
    return isNaN(n) ? 0 : n;
}

/* =======================
   ATUALIZA TOTAL NA TELA
========================== */
function updateTotal() {
    if (!totalEl) return;

    const price = getCurrentPrice(); // valor por 100g
    const total = (currentGrams / 100) * price;

    totalEl.textContent = formatBRL(total);
}

/* Atualiza total ao digitar o preço */
if (priceInput) {
    priceInput.addEventListener("input", () => {
        localStorage.setItem("price100", priceInput.value || "0");
        updateTotal();
    });

    // carrega valor salvo
    const saved = localStorage.getItem("price100");
    if (saved) {
        priceInput.value = saved;
    }
}

/* =======================
   BOTÃO CONECTAR BALANÇA
========================== */
if (btnConnectScale) {
    btnConnectScale.addEventListener("click", () => {
        startFakeScale();
        showToast("Balança conectada!");
    });
}

/* =======================
   MODAL DE PAGAMENTO
========================== */
function openPaymentModal() {
    payModal.classList.remove("hidden");
}

function closePaymentModal() {
    payModal.classList.add("hidden");
    qrWrap.classList.add("hidden");
}

if (closeModal) closeModal.onclick = closePaymentModal;
if (cancelPay) cancelPay.onclick = closePaymentModal;

/* =======================
   BOTÃO COBRAR
========================== */
if (btnCharge) {
    btnCharge.addEventListener("click", () => {
        if (currentGrams <= 0) {
            showToast("Coloque o produto na balança antes de cobrar", true);
            return;
        }

        openPaymentModal();
    });
}

/* =======================
   MÉTODOS DE PAGAMENTO
========================== */
async function sendPayment(method) {
    const description = "Venda no PDV";
    const price = getCurrentPrice();
    const total = (currentGrams / 100) * price;

    const body = {
        amount: Number(total.toFixed(2)),
        description
    };

    try {
        const r = await fetch(`${BACKEND}/create_payment?method=${method}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body)
        });

        const json = await r.json();

        if (!r.ok) {
            showToast("Erro ao gerar pagamento", true);
            return;
        }

        if (method === "pix") {
            qrWrap.classList.remove("hidden");
            qrWrap.innerHTML = `<img src="${json.point_of_interaction.transaction_data.qr_code_base64}" />`;
        } else {
            showToast("Pagamento de cartão criado. Conclua na maquininha.");
        }

    } catch (e) {
        showToast("Falha ao conectar com servidor", true);
    }
}

if (optPix) optPix.onclick = () => sendPayment("pix");
if (optDebit) optDebit.onclick = () => sendPayment("debit");
if (optCredit) optCredit.onclick = () => sendPayment("credit");
