// URL do backend no Render
const BACKEND = "https://rochasa-backend.onrender.com";

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

  // ==== TOAST ====
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

  // ==== CÁLCULO DO TOTAL ====
  function parsePrice100() {
    if (!priceInput) return 0;
    const raw = priceInput.value.replace(".", "").replace(",", ".");
    const v = parseFloat(raw);
    return isNaN(v) ? 0 : v;
  }

  function updateTotal() {
    const price100 = parsePrice100();
    const total = (currentGrams / 100) * price100;
    const formatted = total.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL"
    });
    totalEl.textContent = formatted;
  }

  // ==== SIMULAÇÃO DE BALANÇA (enquanto a real não entra) ====
  function startFakeScale() {
    if (scaleConnected) return;
    scaleConnected = true;
    showToast("Balança conectada (modo demonstração)");

    // Esconde o botão de conectar balança após conectar
    if (btnConnectScale) {
      btnConnectScale.style.display = "none";
    }

    // atualiza peso de tempos em tempos, só pra simular
    setInterval(() => {
      // simulação: de 50g a 900g
      currentGrams = Math.floor(50 + Math.random() * 850);
      weightEl.textContent = `${currentGrams} g`;
      updateTotal();
    }, 2000);
  }

  // ==== CONTROLES DE PAGAMENTO ====
  function openPaymentModal() {
    if (!payModal) return;
    payModal.classList.remove("hidden");
  }

  function closePaymentModal() {
    if (!payModal) return;
    payModal.classList.add("hidden");
  }

  async function createPayment(method) {
    // Método: "debit" | "credit" | "pix"
    const price100 = parsePrice100();
    if (currentGrams <= 0 || price100 <= 0) {
      showToast("Peso ou preço inválido", true);
      return;
    }

    const total = (currentGrams / 100) * price100;

    try {
      showToast("Enviando pagamento...", false);

      const resp = await fetch(`${BACKEND}/create_payment?method=${encodeURIComponent(method)}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          amount: Number(total.toFixed(2)),
          description: "Pedido PDV Rochas Açaí"
        })
      });

      if (!resp.ok) {
        const errTxt = await resp.text();
        console.error("Erro na resposta:", errTxt);
        showToast("Erro ao criar pagamento", true);
        return;
      }

      const data = await resp.json();
      console.log("Resposta Mercado Pago:", data);

      if (method === "pix") {
        showToast("PIX criado. Veja o QR Code na maquininha ou no app.", false);
        // aqui daria pra exibir qrcode se o backend devolvesse a imagem/base64
      } else {
        showToast("Pagamento de cartão criado. Conclua na maquininha.", false);
      }

      closePaymentModal();
    } catch (err) {
      console.error("Erro de rede:", err);
      showToast("Erro de rede ao criar pagamento", true);
    }
  }

  // ==== SENHA CONFIG E RELATÓRIO ====
  function askPasswordAndGo(path) {
    const pass = prompt("Digite a senha (1901):");
    if (pass === "1901") {
      window.location.href = path;
    } else if (pass !== null) {
      showToast("Senha incorreta", true);
    }
  }

  // ==== EVENTOS ====

  // Botão conectar balança
  if (btnConnectScale) {
    btnConnectScale.addEventListener("click", () => {
      // futuramente aqui entra a balança real via WebSerial/USB
      startFakeScale();
    });
  }

  // --------- Função para pegar o preço atual do input ----------
function getCurrentPrice() {
  if (!priceInput) return 0;

  const raw = (priceInput.value || "0").trim();

  // converte "5,90" -> 5.90
  const normalized = raw
    .replace(/\./g, "")   // tira pontos de milhar
    .replace(",", ".");   // troca vírgula por ponto

  const n = Number(normalized);
  return isNaN(n) ? 0 : n;
}

// --------- Atualiza o total na tela ----------
function updateTotal() {
  if (!totalEl) return;

  const price = getCurrentPrice();     // preço por 100g
  const total = (currentGrams / 100) * price;

  totalEl.textContent = formatBRL(total);
}

// Atualizar total ao mudar preço
if (priceInput) {
  priceInput.addEventListener("input", () => {
    // salva o preço novo
    localStorage.setItem("price100", priceInput.value || "0");
    // recalcula o total
    updateTotal();
  });
}
  // Botão COBRAR
  if (btnCharge) {
    btnCharge.addEventListener("click", () => {
      if (currentGrams <= 0) {
        showToast("Coloque o produto na balança antes de cobrar", true);
        return;
      }
      openPaymentModal();
    });
  }

  // Modal de pagamento
  if (closeModal) {
    closeModal.addEventListener("click", closePaymentModal);
  }
  if (cancelPay) {
    cancelPay.addEventListener("click", closePaymentModal);
  }
  if (optDebit) {
    optDebit.addEventListener("click", () => createPayment("debit"));
  }
  if (optCredit) {
    optCredit.addEventListener("click", () => createPayment("credit"));
  }
  if (optPix) {
    optPix.addEventListener("click", () => createPayment("pix"));
  }

  // Botões de Configuração e Relatório
  if (btnConfig) {
    btnConfig.addEventListener("click", () => askPasswordAndGo("config.html"));
  }
  if (btnReport) {
    btnReport.addEventListener("click", () => askPasswordAndGo("relatorio.html"));
  }
});
