// ===============================================
// 🔗 PDV Rochas Açaí — Integração InfinitePay Android
// ===============================================

document.addEventListener("DOMContentLoaded", () => {

    const weightEl = document.getElementById("weight");
    const totalEl = document.getElementById("total");
    const priceInput = document.getElementById("price100");
    const unitNameEl = document.getElementById("unitName");

    const btnConnect = document.getElementById("btnConnectScale");
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

    let currentGrams = 0;
    let scaleConnected = false;

    // ===============================================
    // FUNÇÃO: TOAST
    // ===============================================
    function showToast(msg, isError = false) {
        toastEl.textContent = msg;
        toastEl.classList.remove("hidden");
        toastEl.style.background = isError ? "#b00000" : "#222";
        setTimeout(() => toastEl.classList.add("hidden"), 2500);
    }

    // ===============================================
    // CARREGAR CONFIGURAÇÕES
    // ===============================================
    const savedPrice = localStorage.getItem("preco100");
    if (savedPrice) priceInput.value = savedPrice;

    const savedUnit = localStorage.getItem("unidadeNome");
    if (savedUnit) unitNameEl.textContent = savedUnit;

    setTimeout(updateTotal, 100);

    // ===============================================
    // CÁLCULO DO TOTAL
    // ===============================================
    function parsePrice() {
        return parseFloat(priceInput.value.replace(",", "."));
    }

    function updateTotal() {
        const total = (currentGrams / 100) * parsePrice();
        totalEl.textContent = total.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL",
        });
    }

    // ===============================================
    // BALANÇA SIMULADA
    // ===============================================
    function startFakeScale() {
        if (scaleConnected) return;

        scaleConnected = true;
        btnConnect.style.display = "none";
        showToast("Balança conectada (simulação)");

        setInterval(() => {
            currentGrams = Math.floor(50 + Math.random() * 800);
            weightEl.textContent = currentGrams + " g";
            updateTotal();
        }, 2000);
    }

    // ===============================================
    // MODAL DE PAGAMENTO
    // ===============================================
    function openPaymentModal() {
        payModal.classList.remove("hidden");
    }

    function closePaymentModal() {
        payModal.classList.add("hidden");
    }

    // ===============================================
    // 🔥 INFINITE PAY — TAP TO PAY (ANDROID)
    // ===============================================
    function openInfinitePay(amount) {
        const valorCentavos = Math.round(amount * 100);

        const url = `infinitepay://payment?amount=${valorCentavos}&description=PDV%20Rochas%20Acai`;

        console.log("Abrindo InfinitePay:", url);

        // Abre o app InfinitePay automaticamente
        window.location.href = url;
    }

    // ===============================================
    // EVENTOS DE PAGAMENTO
    // ===============================================
    optDebit.onclick = () => {
        const valor = getTotalAsNumber();
        openInfinitePay(valor);
        closePaymentModal();
    };

    optCredit.onclick = () => {
        const valor = getTotalAsNumber();
        openInfinitePay(valor);
        closePaymentModal();
    };

    optPix.onclick = () => {
        showToast("PIX não está integrado ainda.", true);
    };

    function getTotalAsNumber() {
        return Number(
            totalEl.textContent
                .replace("R$", "")
                .replace(".", "")
                .replace(",", ".")
                .trim()
        );
    }

    // ===============================================
    // EVENTOS GERAIS DA TELA
    // ===============================================

    btnConnect.onclick = startFakeScale;
    priceInput.oninput = updateTotal;

    btnCharge.onclick = () => {
        if (currentGrams <= 0) {
            showToast("Coloque algo na balança", true);
            return;
        }
        openPaymentModal();
    };

    closeModal.onclick = closePaymentModal;
    cancelPay.onclick = closePaymentModal;

    btnConfig.onclick = () => askPasswordAndGo("config.html");
    btnReport.onclick = () => askPasswordAndGo("relatorio.html");

    // ===============================================
    // SENHA (CONFIG E RELATÓRIO)
    // ===============================================
    function askPasswordAndGo(path) {
        const p = prompt("Digite a senha (1901):");
        if (p === "1901") {
            window.location.href = path;
        } else if (p !== null) {
            showToast("Senha incorreta", true);
        }
    }
});
