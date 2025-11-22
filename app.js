/* app.js — Rochas Açaí PDV
   Backend conectado ao Render
*/

// 🔗 URL DO SEU BACKEND
const BACKEND = "https://rochas-backend.onrender.com";

// ELEMENTOS DA TELA
const weightEl = document.getElementById("weight");
const totalEl = document.getElementById("total");
const priceInput = document.getElementById("price100");
const unitNameEl = document.getElementById("unitName");
const btnConnect = document.getElementById("btnConnectScale");
const btnCharge = document.getElementById("btnCharge");
const payModal = document.getElementById("payModal");
const closeModal = document.getElementById("closeModal");
const optDebit = document.getElementById("optDebit");
const optCredit = document.getElementById("optCredit");
const optPix = document.getElementById("optPix");
const qrWrap = document.getElementById("qrWrap");

// VARIÁVEIS
let grams = 0;
let port = null;

/* FORMATADOR DE MOEDA */
function formatBRL(n) {
    return "R$ " + Number(n).toLocaleString("pt-BR", { minimumFractionDigits: 2 });
}

/* SIMULAÇÃO DE BALANÇA (enquanto não conecta a real) */
function simulateScale() {
    grams = Math.floor(Math.random() * 800) + 30;
    weightEl.textContent = grams + " g";
    updateTotal();
}

/* ATUALIZA TOTAL */
function updateTotal() {
    const price = parseFloat(priceInput.value.replace(",", "."));
    const total = ((grams / 100) * price);
    totalEl.textContent = formatBRL(total);

    return total;
}

/* CONECTAR BALANÇA */
btnConnect.addEventListener("click", () => {
    simulateScale();
    btnConnect.style.display = "none"; // esconder o botão ao conectar
});

/* BOTÃO COBRAR */
btnCharge.addEventListener("click", () => {
    payModal.style.display = "flex";
});

/* FECHAR MODAL */
closeModal.addEventListener("click", () => {
    payModal.style.display = "none";
    qrWrap.innerHTML = "";
});

/* MÉTODO DE PAGAMENTO */
optDebit.onclick = () => createPayment("debit");
optCredit.onclick = () => createPayment("credit");
optPix.onclick = () => createPayment("pix");

/* CRIAÇÃO DO PAGAMENTO */
async function createPayment(method) {

    const total = updateTotal();

    if(total <= 0){
        alert("Peso ou preço inválido.");
        return;
    }

    try {
        const resp = await fetch(`${BACKEND}/create_payment?method=${method}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                amount: total,
                description: "Açaí por peso — Rochas Açaí"
            })
        });

        const data = await resp.json();

        if (!resp.ok) {
            alert("Erro no servidor: " + data.error);
            return;
        }

        // SE FOR PIX, MOSTRA QR CODE
        if(method === "pix"){
            qrWrap.innerHTML = `<img src="${data.qr}" style="width:240px;border-radius:12px;">`;
        } else {
            alert("Pagamento criado! ID: " + data.id);
        }

        salvarVenda(total, method);

    } catch (e) {
        alert("Erro de rede: " + e.message);
    }
}

/* SALVAR VENDA NO LOCALSTORAGE */
function salvarVenda(total, method){

    const vendas = JSON.parse(localStorage.getItem("vendas")) || [];

    vendas.push({
        data: new Date().toLocaleString(),
        peso: grams + " g",
        total: formatBRL(total),
        forma: method
    });

    localStorage.setItem("vendas", JSON.stringify(vendas));
