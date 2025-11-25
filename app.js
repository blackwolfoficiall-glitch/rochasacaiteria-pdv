document.addEventListener("DOMContentLoaded", () => {

const weightEl=document.getElementById("weight");
const totalEl=document.getElementById("total");
const priceInput=document.getElementById("price100");
const unitNameEl=document.getElementById("unitName");

const btnConnect=document.getElementById("btnConnectScale");
const btnCharge=document.getElementById("btnCharge");
const btnConfig=document.getElementById("btnConfig");
const btnReport=document.getElementById("btnReport");

const payModal=document.getElementById("payModal");
const closeModal=document.getElementById("closeModal");
const cancelPay=document.getElementById("cancelPay");
const optDebit=document.getElementById("optDebit");
const optCredit=document.getElementById("optCredit");
const optPix=document.getElementById("optPix");
const toastEl=document.getElementById("toast");

let currentGrams=0, scaleConnected=false;

function showToast(msg,err=false){
 toastEl.textContent=msg;
 toastEl.classList.remove("hidden");
 toastEl.style.background=err?"#b00000":"#222";
 setTimeout(()=>toastEl.classList.add("hidden"),2500);
}

function parsePrice(){
 return parseFloat(priceInput.value.replace(",","."));
}

function updateTotal(){
 const t=(currentGrams/100)*parsePrice();
 totalEl.textContent = t.toLocaleString("pt-BR",{style:"currency",currency:"BRL"});
}

// Carregar configs
const savedPrice=localStorage.getItem("preco100");
if(savedPrice) priceInput.value=savedPrice;

const savedUnit=localStorage.getItem("unidadeNome");
if(savedUnit) unitNameEl.textContent=savedUnit;

setTimeout(updateTotal,200);

// Balança Fake
function startFake(){
 if(scaleConnected) return;
 scaleConnected=true;
 btnConnect.style.display="none";
 setInterval(()=>{
  currentGrams=Math.floor(50+Math.random()*800);
  weightEl.textContent=currentGrams+" g";
  updateTotal();
 },2000);
 showToast("Balança conectada");
}

btnConnect.onclick=startFake;

// preço muda
priceInput.oninput=updateTotal;

// cobrar
btnCharge.onclick=()=>{ 
 if(currentGrams<=0){showToast("Coloque algo na balança",true);return;}
 payModal.classList.remove("hidden");
};

closeModal.onclick=()=>payModal.classList.add("hidden");
cancelPay.onclick=()=>payModal.classList.add("hidden");

// métodos de pagamento
optDebit.onclick=()=>{ showToast("Pagamento débito enviado"); payModal.classList.add("hidden"); };
optCredit.onclick=()=>{ showToast("Pagamento crédito enviado"); payModal.classList.add("hidden"); };
optPix.onclick=()=>{ showToast("PIX gerado"); payModal.classList.add("hidden"); };

// Config e relatório
btnConfig.onclick=()=>{ window.location.href="config.html"; };
btnReport.onclick=()=>{ window.location.href="relatorio.html"; };

});
