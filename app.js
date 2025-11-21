/* ================================================
   ROCHAS AÇAÍ — PDV WEB (APP.JS COMPLETO)
================================================ */

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
let reader = null;

/* FORMATAR */
function formatBRL(n){
  return 'R$ ' + Number(n).toLocaleString('pt-BR',{minimumFractionDigits:2,maximumFractionDigits:2});
}

function updateUI(){
  weightEl.innerText = `${Math.round(grams)} g`;
  const price = parseFloat(priceInput.value || 0);
  const total = (grams/100.0) * price;
  totalEl.innerText = formatBRL(total || 0);
}

/* FULLSCREEN */
async function goFullscreen(){
  try{ await document.documentElement.requestFullscreen(); }catch(e){}
}

/* CONECTAR BALANÇA - WEBSERIAL */
async function connectWebSerial(){
  if(!('serial' in navigator)){
    alert("Seu navegador não suporta WebSerial.");
    return;
  }

  try{
    port = await navigator.serial.requestPort();
    await port.open({ baudRate: 9600 });
    readLoop();
  }catch(e){
    alert("Erro ao conectar: " + e.message);
  }
}

async function readLoop(){
  const decoder = new TextDecoderStream();
  port.readable.pipeTo(decoder.writable);
  reader = decoder.readable.getReader();

  while(true){
    const { value, done } = await reader.read();
    if(done) break;
    if(value) parseScaleData(value);
  }
}

function parseScaleData(text){
  const m = String(text).match(/-?\d+[\.,]?\d*/);
  if(!m) return;
  let val = parseFloat(m[0].replace(",","."));
  if(val >= 0 && val < 20000){
    grams = val;
    updateUI();
  }
}

/* MOSTRAR QR */
function showQr(url){
  qrWrap.innerHTML = "";
  const img = document.createElement("img");
  img.src = "https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=" + encodeURIComponent(url);
  qrWrap.appendChild(img);

  const link = document.createElement("a");
  link.href = url;
  link.target = "_blank";
  link.innerText = "Abrir pagamento";
  qrWrap.appendChild(document.createElement("br"));
  qrWrap.appendChild(link);
}

/* CRIAR PAGAMENTO */
async function createPayment(method){
  const total = ((grams/100.0) * parseFloat(priceInput.value)).toFixed(2);
  if(total <= 0){
    alert("Valor inválido.");
    return;
  }

  // 🔥 TROCAR PELA URL DO SEU BACKEND (Render/Railway)
  const BACKEND = "https://rochas-backend.onrender.com";
  const resp = await fetch(`${BACKEND}/create_payment?method=${method}`,{
    method:"POST",
    headers:{ "Content-Type":"application/json" },
    body: JSON.stringify({
      amount: total,
      description: "Açaí por peso — Rochas Açaí"
    })
  });

  const data = await resp.json();

  if(data.init_point) return showQr(data.init_point);

  if(data.point_of_interaction?.transaction_data?.ticket_url)
    return showQr(data.point_of_interaction.transaction_data.ticket_url);

  alert("Erro inesperado");
  console.log(data);
}

/* EVENTOS */
btnConnect.addEventListener("click", connectWebSerial);

btnCharge.addEventListener("click", ()=>{
  payModal.classList.remove("hidden");
});

closeModal.addEventListener("click", ()=>{
  payModal.classList.add("hidden");
});

optDebit.addEventListener("click",()=>{
  payModal.classList.add("hidden");
  createPayment("debit");
});

optCredit.addEventListener("click",()=>{
  payModal.classList.add("hidden");
  createPayment("credit");
});

optPix.addEventListener("click",()=>{
  payModal.classList.add("hidden");
  createPayment("pix");
});

window.addEventListener("load",()=>{
  updateUI();
  setTimeout(goFullscreen, 500);
});
