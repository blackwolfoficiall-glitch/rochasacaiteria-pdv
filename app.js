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

  /* =============================
        TOAST (notificação)
     ============================= */
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

  /* =======================================
        PREÇO POR 100G (corrigido)
     ======================================= */
  function getPrice100() {
    if (!priceInput) return 0;

    const raw = priceInput.value
      .replace(/\./g, "")   // remove pontos
      .replace(",", ".");   // troca vírgula por ponto

    const n = Number(raw);
    return isNaN(n) ? 0 : n;
  }

  function updateTotal() {
    const price100 = getPrice100();
    const total = (currentGrams / 100) * price100;

    totalEl.textContent = total.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL"
    });
  }

  // Atualiza total sempre que o usuário digitar o preço
  if (priceInput) {
    priceInput.addEventListener("input", () => {
      updateTotal();
    });
  }

  /* =======================================
          BALANÇA FAKE
     ======================================= */
  function startFakeScale() {
    if (scaleConnected) return;
    scaleConnected = true;

    showToast("Balança conectada!");

    // Some o botão
    if (btnConnectScale) btnConnectScale.style.display = "none";

    // Simula peso mudando
    setInterval(() => {
      currentGrams = Math.floor(50 + Math.random() * 850);
      weightEl.textContent = `${currentGrams} g`;
      updateTotal();
    }, 1800);
  }

  /* =======================================
          PAGAMENTO
     ======================================= */
  async function createPayment(method) {
    const price100 = getPrice100();

    if (currentGrams <= 0) {
      showToast("Peso inválido!", true);
      return;
    }
    if (price100 <= 0) {
      showToast("Preço inválido!", true);
      return;
    }

    const total = (currentGrams / 100) * price100;

    try {
      showToast("Enviando pagamento...");

      const resp = await fetch(
        `${BACKEND}/create_payment?method=${encodeURIComponent(method)}`,
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

      const data = await resp.json();
      console.log("RESPOSTA MP:", data);

      if (method === "pix") {
        showToast("PIX criado! Veja o QR Code na maquininha.");
      } else {
        showToast("Pagamento criado! Conclua na maquininha.");
      }

      closePaymentModal();

    } catch (e) {
      console.error(e);
      showToast("Erro de rede!", true);
    }
  }

  /* =======================================
          MODAL
     ======================================= */
  function openPaymentModal() {
    payModal.classList.remove("hidden");
  }

  function closePaymentModal() {
    payModal.classList.add("hidden");
  }

  if (closeModal) closeModal.onclick = closePaymentModal;
  if (cancelPay) cancelPay.onclick = closePaymentModal;

  /* =======================================
          SENHA (CONFIG E RELATÓRIO)
     ======================================= */
  function askPassword(path) {
    const pass = prompt("Digite a senha (1901):");
    if (pass === "1901") window.location.href = path;
    else if (pass !== null) showToast("Senha incorreta!", true);
  }

  /* =======================================
          EVENTOS DOS BOTÕES
     ======================================= */

  if (btnConnectScale) {
    btnConnectScale.addEventListener("click", startFakeScale);
  }

  if (btnCharge) {
    btnCharge.addEventListener("click", () => {
      if (currentGrams <= 0) {
        showToast("Coloque na balança antes de cobrar!", true);
        return;
      }
      openPaymentModal();
    });
  }

  if (optDebit) optDebit.onclick = () => createPayment("debit");
  if (optCredit) optCredit.onclick = () => createPayment("credit");
  if (optPix) optPix.onclick = () => createPayment("pix");

  if (btnConfig) {
    btnConfig.addEventListener("click", () => askPassword("config.html"));
  }
  if (btnReport) {
    btnReport.addEventListener("click", () => askPassword("relatorio.html"));
  }
});
