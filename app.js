/* app.js — Rochas Açaí PDV */

// URL DO SEU BACKEND (Render)
const BACKEND = "https://rochasa-backend.onrender.com";

// ELEMENTOS DA TELA
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
const toast = document.getElementById("toast");

let grams = 0;

// FORMATADOR
function formatBRL(n) {
  return "R$ " + Number(n).toLocaleString("pt-BR", { minimumFractionDigits: 2 });
}

// TOAST
function showToast(msg) {
  toast.textContent = msg;
  toast.classList.remove("hidden");
  setTimeout(() => toast.classList.add("hidden"), 2500);
}

// SIMULAÇÃO DE BALANÇA (trocar futuramente)
function simulateScale() {
  grams = Math.floor(Math.random() * 500 + 20); // 20g–500g
  weightEl.textContent = grams + " g";

  let preco = parseFloat(priceInput.value.replace(",", "."));
  if (isNaN(preco)) preco = 0;
  const total = (grams / 100) * preco;

  totalEl.textContent = formatBRL(total);
}

// BOTÃO DE CONECTAR BALANÇA
btnConnectScale.onclick = () => {
  showToast("Balança simulada conectada!");
  setInterval(simulateScale, 1500);
};

// BOTÃO COBRAR
btnCharge.onclick = () => {
  if (grams <= 0) {
    showToast("Peso inválido!");
    return;
  }
  payModal.classList.remove("hidden");
};

// FECHAR MODAL
closeModal.onclick = () => payModal.classList.add("hidden");
cancelPay.onclick = () => payModal.classList.add("hidden");

// PAGAMENTO (ENVIO DE REQUISIÇÃO AO BACKEND)
async function enviarPagamento(tipo) {
  showToast("Criando pagamento...");

  let valorNum = parseFloat(
    totalEl.textContent.replace("R$", "").replace(",", ".")
  );

  try {
    const res = await fetch(`${BACKEND}/pay`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        amount: valorNum,
        method: tipo,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      showToast("Erro no pagamento");
      return;
    }

    // PIX
    if (data.qr) {
      qrWrap.classList.remove("hidden");
      qrWrap.innerHTML = `<img src="${data.qr}" class="qr-img">`;
    }

    showToast("Pagamento enviado à maquininha!");
  } catch (e) {
    showToast("Erro de rede");
  }
}

// EVENTOS DE PAGAMENTO
optDebit.onclick = () => enviarPagamento("debit");
optCredit.onclick = () => enviarPagamento("credit");
optPix.onclick = () => enviarPagamento("pix");

// NAVEGAÇÃO (CONFIG E RELATÓRIO COM SENHA)
btnConfig.onclick = () => {
  const s = prompt("Senha da gerência:");
  if (s === "1901") window.location.href = "config.html";
  else showToast("Senha incorreta!");
};

btnReport.onclick = () => {
  const s = prompt("Senha da gerência:");
  if (s === "1901") window.location.href = "relatorio.html";
  else showToast("Senha incorreta!");
};
