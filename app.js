// ===============================================
// 🔗 Integração direta com InfinitePay (Android)
// ===============================================

// Não há backend. Todo pagamento abre direto o app da InfinitePay no tablet Android.

// -----------------------------------------------
// Função para abrir o app da InfinitePay via deep link
// -----------------------------------------------
function openInfinitePay(amount, method) {

    // InfinitePay recebe em centavos
    const cents = Math.round(amount * 100);

    // Monta o link deep link oficial
    const url = `infinitepay://payment?amount=${cents}&description=PDV%20Rochas%20Acai`;

    console.log("Abrindo InfinitePay:", url);

    // Abre diretamente o app InfinitePay
    window.location.href = url;
}


// ===============================================
// INICIALIZAÇÃO DO PDV
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


    // Toast
    function showToast(msg, isError = false) {
        toastEl.textContent = msg;
        toastEl.classList.remove("hidden");
        toastEl.style.background = isError ? "#b00000" : "#222";
        setTimeout(() => toastEl.classList.add("hidden"), 2500);
    }


    // Carregar configurações salvas
    const savedPrice = localStorage.getItem("preco100");
    if (savedPrice) priceInput.value = savedPrice;

    const savedUnit = localStorage.getItem("unidadeNome");
    if (savedUnit) unitNameEl.textContent = savedUnit;


    // Cálculo do total
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


    // Simulação de balança
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


    // Modal pagamento
    function openPaymentModal() {
        payModal.classList.remove("hidden");
    }

    function closePaymentModal() {
        payModal.classList.add("hidden");
    }


    // Quando escolher forma de pagamento
    function processPayment(method) {
        const price = parsePrice();
        if (price <= 0 || currentGrams <= 0) {
            showToast("Peso ou preço inválido!", true);
            return;
        }

        const total = Number(((currentGrams / 100) * price).toFixed(2));

        closePaymentModal();
        showToast("Abrindo InfinitePay...");

        // Chama deep link
        openInfinitePay(total, method);
    }


    // Eventos
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

    optDebit.onclick = () => processPayment("debit");
    optCredit.onclick = () => processPayment("credit");
    optPix.onclick = () => processPayment("pix");

    btnConfig.onclick = () => askPasswordAndGo("config.html");
    btnReport.onclick = () => askPasswordAndGo("relatorio.html");


    function askPasswordAndGo(path) {
        const p = prompt("Digite a senha (1901):");
        if (p === "1901") window.location.href = path;
        else if (p !== null) showToast("Senha incorreta", true);
    }

});
