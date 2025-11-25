// ===============================
// URL do backend (caso use futuramente)
// ===============================
const BACKEND = "https://rochasa-backend.onrender.com";

document.addEventListener("DOMContentLoaded", () => {

    // ===============================
    // ELEMENTOS DA TELA
    ===============================
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


    // ===============================
    // VARIÁVEIS
    // ===============================
    let currentGrams = 0;
    let scaleConnected = false;


    // ===============================
    // TOAST
    // ===============================
    function showToast(msg, isError = false) {
        toastEl.textContent = msg;
        toastEl.classList.remove("hidden");
        toastEl.style.background = isError ? "#b00000" : "#222";
        setTimeout(() => toastEl.classList.add("hidden"), 2600);
    }


    // ===============================
    // CÁLCULO DE TOTAL
    // ===============================
    function parsePrice() {
        return parseFloat((priceInput.value || "0").replace(",", "."));
    }

    function updateTotal() {
        const total = (currentGrams / 100) * parsePrice();
        totalEl.textContent = total.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL"
        });
    }


    // ===============================
    // CARREGAR CONFIG (preço + nome da unidade)
    // ===============================
    const savedPrice = localStorage.getItem("preco100");
    if (savedPrice) priceInput.value = savedPrice;

    const savedUnit = localStorage.getItem("unidadeNome");
    if (savedUnit && unitNameEl) unitNameEl.textContent = savedUnit;

    setTimeout(updateTotal, 200);


    // ===============================
    // BALANÇA FAKE
    // ===============================
    function startFake() {
        if (scaleConnected) return;
        scaleConnected = true;

        btnConnect.style.display = "none";
        showToast("Balança conectada!");

        setInterval(() => {
            currentGrams = Math.floor(50 + Math.random() * 800);
            weightEl.textContent = `${currentGrams} g`;
            updateTotal();
        }, 2000);
    }

    btnConnect.onclick = startFake;


    // ===============================
    // ATUALIZAR TOTAL AO DIGITAR O PREÇO
    // ===============================
    priceInput.oninput = updateTotal;


    // ===============================
    // COBRAR
    // ===============================
    btnCharge.onclick = () => {
        if (currentGrams <= 0) {
            showToast("Coloque o produto na balança!", true);
            return;
        }
        payModal.classList.remove("hidden");
    };

    closeModal.onclick = () => payModal.classList.add("hidden");
    cancelPay.onclick = () => payModal.classList.add("hidden");


    // ===============================
    // MÉTODOS DE PAGAMENTO (fake)
    // ===============================
    optDebit.onclick = () => {
        showToast("Pagamento no débito enviado");
        payModal.classList.add("hidden");
    };

    optCredit.onclick = () => {
        showToast("Pagamento no crédito enviado");
        payModal.classList.add("hidden");
    };

    optPix.onclick = () => {
        showToast("PIX gerado!");
        payModal.classList.add("hidden");
    };


    // ===============================
    // PROTEÇÃO POR SENHA
    // ===============================
    function askPasswordAndGo(path) {
        const pass = prompt("Digite a senha (1901):");
        if (pass === "1901") {
            window.location.href = path;
        } else if (pass !== null) {
            showToast("Senha incorreta!", true);
        }
    }

    btnConfig.onclick = () => askPasswordAndGo("config.html");
    btnReport.onclick = () => askPasswordAndGo("relatorio.html");

});
