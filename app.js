// ===============================================
// 🔗 URL DO BACKEND (Render)
// ===============================================
const API_URL = "https://rochas-pdv-backend.onrender.com";

document.addEventListener("DOMContentLoaded", () => {

    // ELEMENTOS
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

    // Detectar iPhone ou Android
    const IS_MOBILE = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

    function showToast(msg, isError = false) {
        toastEl.textContent = msg;
        toastEl.classList.remove("hidden");
        toastEl.style.background = isError ? "#b00000" : "#222";
        setTimeout(() => toastEl.classList.add("hidden"), 2500);
    }

    // PREÇO E UNIDADE
    const savedPrice = localStorage.getItem("preco100");
    if (savedPrice) priceInput.value = savedPrice;

    const savedUnit = localStorage.getItem("unidadeNome");
    if (savedUnit) unitNameEl.textContent = savedUnit;

    setTimeout(updateTotal, 100);

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

    // BALANÇA FAKE (DEMONSTRAÇÃO)
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

    // MODAL
    function openPaymentModal() { payModal.classList.remove("hidden"); }
    function closePaymentModal() { payModal.classList.add("hidden"); }

    // ABRIR MERCADO PAGO TAP TO PAY
    function openMercadoPago(amount) {
        const link = `mercadopago://payment/point?amount=${amount}`;

        showToast("Abrindo Mercado Pago…");

        // Abre o app Mercado Pago
        window.location.href = link;
    }

    // ENVIO DE PAGAMENTO
    async function sendPayment(method) {
        const price = parsePrice();
        if (price <= 0 || currentGrams <= 0) {
            showToast("Peso ou preço inválido!", true);
            return;
        }

        const total = Number(((currentGrams / 100) * price).toFixed(2));

        // PIX → chama backend
        if (method === "pix") {
            try {
                showToast("Gerando PIX...");
                const res = await fetch(`${API_URL}/create_payment?method=pix`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        amount: total,
                        description: "Pedido PDV Rochas Açaí"
                    })
                });

                const data = await res.json();
                if (!res.ok) return showToast("Erro ao gerar PIX", true);

                const qr = data.point_of_interaction.transaction_data.qr_code_base64;

                const qrWrap = document.getElementById("qrWrap");
                qrWrap.classList.remove("hidden");
                qrWrap.innerHTML = `<img src="${qr}" style="width:250px">`;

            } catch (err) {
                showToast("Erro ao gerar PIX!", true);
            }

            return;
        }

        // CARTÃO → abrir Mercado Pago
        openMercadoPago(total);
        closePaymentModal();
    }

    // EVENTOS
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

    optDebit.onclick = () => sendPayment("debit");
    optCredit.onclick = () => sendPayment("credit");
    optPix.onclick = () => sendPayment("pix");

    btnConfig.onclick = () => {
        const p = prompt("Digite a senha (1901):");
        if (p === "1901") window.location.href = "config.html";
        else showToast("Senha incorreta", true);
    };

    btnReport.onclick = () => {
        const p = prompt("Digite a senha (1901):");
        if (p === "1901") window.location.href = "relatorio.html";
        else showToast("Senha incorreta", true);
    };
});
