/* ============================
   ROCHAS AÇAÍ — PDV
   app.js (versão corrigida)
============================ */

const weightEl = document.getElementById("weight");
const totalEl = document.getElementById("total");
const priceInput = document.getElementById("price100");
const btnConnect = document.getElementById("connectScale");
const btnCharge = document.getElementById("charge");
const qrWrap = document.getElementById("qrWrap");

const payModal = document.getElementById("payModal");
const optDebit = document.getElementById("optDebit");
const optCredit = document.getElementById("optCredit");
const optPix = document.getElementById("optPix");
const closeModal = document.getElementById("closeModal");

let grams = 0;
let port = null;

/* ============================
   FORMATADOR
============================ */
function formatBRL(n){
  return 'R$ ' + Number(n).toLocaleString('pt-BR',{minimumFractionDigits:2});
}

/* ============================
   ATUALIZAR TELA
============================ */
function updateUI(){
  weightEl.innerText = `${Math.round(grams)} g`;
  const price = parseFloat(priceInput.value || 0);
  const total = (grams / 100.0) * price;
  totalEl.innerText = formatBRL(total || 0);
}

/* Atualiza total quando muda o preço */
priceInput.addEventListener("input", updateUI);

/* ============================
   WEBSERIAL – BALANÇA
============================ */
async function connectWebSerial(){
  if(!("serial" in navigator)){
    alert("Seu navegador não suporta WebSerial.");
    return;
  }

  try{
    port = await navigator.serial.requestPort();
    await port.open({ baudRate: 9600 });

    // esconder botão ao conectar
    btnConnect.style.display = "none";

    const decoder = new TextDecoderStream();
    port.readable.pipeTo(decoder.writable);
    const reader = decoder.readable.getReader();

    while(true){
      const { value, done } = await reader.read();
      if(done) break;

      const m = String(value).match(/-?\d+[\.,]?\d*/);
      if(m){
        let val = parseFloat(m[0].replace(",","."));
        if(val >= 0 && val < 20000){
          grams = val;
          updateUI();
        }
      }
    }

  }catch(err){
    alert("Erro ao conectar: " + err);
    btnConnect.style.display = "block";
  }
}

btnConnect.addEventListener("click", connectWebSerial);

/* ============================
   BACKEND (Render)
============================ */
const BACKEND = "https://rochas-backend.onrender.com";

/* ============================
   PAGAMENTO
============================ */
async function createPayment(method){
  const price = parseFloat(priceInput.value);
  const total = ((grams / 100) * price).toFixed(2);

  if(total <= 0){
    alert("Valor inválido.");
    return;
  }

  const resp = await fetch(`${BACKEND}/create_payment?method=${method}`, {
    method:"POST",
    headers:{ "Content-Type":"application/json" },
    body: JSON.stringify({
      amount: total,
      description: "Açaí por peso — Rochas Açaí"
    })
  });

  const data = await resp.json();

  // PIX
  if(data.point_of_interaction){
    const url = data.point_of_interaction.transaction_data.ticket_url;
    return showQr(url);
  }

  // Cartão
  if(data.init_point){
    return showQr(data.init_point);
  }

  alert("Erro no pagamento");
}

/* ============================
   MOSTRAR QR CODE
============================ */
function showQr(url){
  qrWrap.innerHTML = "";
  const img = document.createElement("img");
  img.src = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(url)}`;
  qrWrap.appendChild(img);
}

/* ============================
   MODAL DE PAGAMENTO
============================ */
btnCharge.addEventListener("click", ()=>{
  payModal.classList.remove("hidden");
});

closeModal.addEventListener("click", ()=>{
  payModal.classList.add("hidden");
});

optDebit.addEventListener("click", ()=>{
  payModal.classList.add("hidden");
  createPayment("debit");
});

optCredit.addEventListener("click", ()=>{
  payModal.classList.add("hidden");
  createPayment("credit");
});

optPix.addEventListener("click", ()=>{
  payModal.classList.add("hidden");
  createPayment("pix");
});

/* Inicial */
window.addEventListener("load", updateUI);
