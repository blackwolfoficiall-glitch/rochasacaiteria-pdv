document.addEventListener("DOMContentLoaded", () => {

    // ================= ELEMENTOS =================
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


    // ================= TOAST =================
    function showToast(msg, err = false) {
        toastEl.textContent = msg;
        toastEl.classList.remove("hidden");
        toastEl.style.background = err ? "#b00000" : "#222";

        setTimeout(() => toastEl.classList.add("hidden"), 2500);
    }


    // ================= PREÇO E TOTAL =================
    function parsePrice() {
        return parseFloat(priceInput.value.replace(",", "."));
    }

    function updateTotal() {
        const t = (currentGrams / 100) * parsePrice();
        totalEl.textContent = t.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL"
        });
    }


    // ================= CONFIG SALVA =================
    const savedPrice = localStorage.getItem("preco100");
    if (savedPrice) priceInput.value = savedPrice;

    const savedUnit = localStorage.getItem("unidadeNome");
    if (savedUnit) unitNameEl.textContent = savedUnit;

    setTimeout(updateTotal, 200);


    // ================= BALANÇA FAKE =================
    function startFake() {
        if (scaleConnected) return;

        scaleConnected = true;
        btnConnect.style.display = "none";

        showToast("Balança conectada");

        setInterval(() => {
            currentGrams = Math.floor(50 + Math.random() * 800);
            weightEl.textContent = currentGrams + " g";
            updateTotal();
        }, 2000);
    }

    btnConnect.onclick = startFake;


    // ================= COBRAR =================
    priceInput.oninput = updateTotal;

    btnCharge.onclick = () => {
        if (currentGrams <= 0) {
            showToast("Coloque algo na balança", true);
            return;
        }
        payModal.classList.remove("hidden");
    };

    closeModal.onclick = () => payModal.classList.add("hidden");
    cancelPay.onclick = () => payModal.classList.add("hidden");


    // ================= PAGAMENTOS (DEMO) =================
    optDebit.onclick = () => { showToast("Pagamento débito enviado"); payModal.classList.add("hidden"); };
    optCredit.onclick = () => { showToast("Pagamento crédito enviado"); payModal.classList.add("hidden"); };
    optPix.onclick = () => { showToast("PIX gerado"); payModal.classList.add("hidden"); };


    // ================= SENHA DE ACESSO =================
    function senha(path) {
        const pass = prompt("Digite a senha (1901):");
        if (pass === "1901") {
            window.location.href = path;
        } else {
            showToast("Senha incorreta", true);
        }
    }

    btnConfig.onclick = () => senha("config.html");
    btnReport.onclick = () => senha("relatorio.html");

});
