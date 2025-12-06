// ===============================================
// 🔗 INTEGRAÇÃO COM INFINITEPAY (Deep Link)
// ===============================================
// O PDV irá chamar: infinitepay://checkout?amount=XX.XX&orderId=XXXX
// Isso abre automaticamente o app InfinitePay na tela de cobrança.

document.addEventListener("DOMContentLoaded", () => {

    // -------------------------------------------
    // ELEMENTOS DA TELA
    // -------------------------------------------
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



    // -------------------------------------------
    // FUNÇÃO DE AVISO (TOAST)
    // -------------------------------------------
    function showToast(msg, isError = false) {
        toastEl.textContent = msg;
        toastEl.classList.remove("hidden");
        toastEl.style.background = isError ? "#b00000" : "#222";
        setTimeout(() => toastEl.classList.add("hidden"), 2500);
    }



    // -------------------------------------------
    // CARREGA CONFIGURAÇÕES SALVAS
    // -------------------------------------------
    const savedPrice = localStorage.getItem("preco100");
    if (savedPrice) priceInput.value = savedPrice;

    const savedUnit = localStorage.getItem("unidadeNome");
    if (savedUnit) unitNameEl.textContent = savedUnit;

    setTimeout(updateTotal, 100);



    // -------------------------------------------
    // CÁLCULO DO TOTAL
    // -------------------------------------------
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



    // -------------------------------------------
    // BALANÇA FAKE (para simulação)
    // -------------------------------------------
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



    // -------------------------------------------
    // MODAL DE PAGAMENTO
    // -------------------------------------------
    function openPaymentModal() {
        payModal.classList.remove("hidden");
    }

    function closePaymentModal() {
        payModal.classList.add("hidden");
    }



    // ===============================================
    // 🔥 PAGAMENTO VIA INFINITEPAY (DEEP LINK)
    // ===============================================
    function pagarInfinitePay() {

        const price = parsePrice();
        if (price <= 0 || currentGrams <= 0) {
            showToast("Peso ou preço inválido!", true);
            return;
        }

        const total = Number(((currentGrams / 100) * price).toFixed(2));

        const orderId = "PDV-" + Date.now();

        const deepLink = `infinitepay://checkout?amount=${total}&orderId=${orderId}`;

        showToast("Abrindo InfinitePay...");

        // ABRE O APLICATIVO INFINITEPAY NO ANDROID
        window.location.href = deepLink;

        closePaymentModal();
    }



    // -------------------------------------------
    // SENHA PARA CONFIG E RELATÓRIO
    // -------------------------------------------
    function askPasswordAndGo(path) {
        const p = prompt("Digite a senha (1901):");
        if (p === "1901") {
            window.location.href = path;
        } else if (p !== null) {
            showToast("Senha incorreta", true);
        }
    }



    // -------------------------------------------
    // EVENTOS DOS BOTÕES
    // -------------------------------------------
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

    // 🔥 AQUI CHAMA O TAP TO PAY DA INFINITE PAY
    optDebit.onclick = pagarInfinitePay;
    optCredit.onclick = pagarInfinitePay;
    optPix.onclick = pagarInfinitePay; // opcional, pode remover

    btnConfig.onclick = () => askPasswordAndGo("config.html");
    btnReport.onclick = () => askPasswordAndGo("relatorio.html");

});
