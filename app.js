/* app.js - Rochas Açaí PDV
   1) Atualize BACKEND para sua URL de backend (Render/Railway)
   2) Quando integrar maquininha/SDK, substitua a função `simulateScale` pela leitura real.
*/

const BACKEND = "https://SEU_BACKEND.onrenderer.com"; // <<--- Troque aqui

// elementos
const weightEl = document.getElementById("weight");
const totalEl = document.getElementById("total");
const priceInput = document.getElementById("price100");
const btnConnect = document.getElementById("btnConnectScale");
const btnCharge = document.getElementById("btnCharge");
const payModal = document.getElementById("payModal");
const closeModal = document.getElementById("closeModal");
const optDebit = document.getElementById("optDebit");
const optCredit = document.getElementById("optCredit");
const optPix = document.getElementById("optPix");
const cancelPay = document.getElementById("cancelPay");
const qrWrap = document.getElementById("qrWrap");
const toast = document.getElementById("toast");

const btnConfig = document.getElementById("btnConfig");
const btnReport = document.getElementById("btnReport");
const unitNameEl = document.getElementById("unitName");

// estado
let grams = 0;
let connected = false;
let scaleInterval = null;

// CONFIG: altere o nome da unidade de rede (ou carregue dinamicamente)
const UNIT_NAME = "Rochas — Feira de Santana";
unitNameEl.innerText = UNIT_NAME;

// formatador
function formatBRL(n){
  n = Number(n);
  return n.toLocaleString("pt-BR",{style:"currency",currency:"BRL",minimumFractionDigits:2});
}

// atualiza total a partir do preço e grams
function updateTotalUI(){
  const raw = priceInput.value.replace(",",".").trim();
  const price = parseFloat(raw) || 0;
  const total = (grams/100.0) * price;
  totalEl.innerText = formatBRL(total);
  weightEl.innerText = `${Math.round(grams)} g`;
}

// lidar com input de preço
priceInput.addEventListener("input",()=>{
  // normaliza vírgula para display, mas aceita entrada
  updateTotalUI();
});

// conectar balança (simulação)
// Substitua esta função para usar WebUSB ou Serial quando tiver a balança real.
// Depois de conectar, botão some.
btnConnect.addEventListener("click", async ()=>{
  if(connected) return;
  // tente conectar dispositivo de verdade aqui...
  // se falhar, entramos em modo "simulado" para teste
  showToast("Conectando balança...");
  await new Promise(r=>setTimeout(r,600));
  connected = true;
  btnConnect.style.display = "none"; // esconde botão depois de conectar
  showToast("Balança conectada (modo simulado).");
  // iniciar leitura simulada
  scaleInterval = setInterval(simulateScale, 700);
});

// simula leitura da balança (a cada tick altera grams)
function simulateScale(){
  // variação aleatória entre 0 e 1000g para teste (você pode subir/abaixar)
  // quando quiser, coloque o peso real aqui
  grams = Math.max(0, grams + (Math.random()-0.5)*40); // pequeno ruído
  updateTotalUI();
}

// COBRAR
btnCharge.addEventListener("click", () => {
  // valida total
  const raw = priceInput.value.replace(",",".").trim();
  const price = parseFloat(raw) || 0;
  const total = (grams/100.0) * price;
  if(total <= 0.0){
    alert("Valor inválido.");
    return;
  }
  // abrir modal
  payModal.classList.remove("hidden");
  qrWrap.classList.add("hidden");
});

// fechar modal
closeModal.addEventListener("click", ()=>payModal.classList.add("hidden"));
cancelPay.addEventListener("click", ()=>payModal.classList.add("hidden"));

// ações de pagamento
async function createPayment(method){
  const raw = priceInput.value.replace(",",".").trim();
  const price = parseFloat(raw) || 0;
  const amount = Number(((grams/100.0) * price).toFixed(2));
  if(amount <= 0){
    alert("Valor inválido.");
    return;
  }

  showToast("Criando pagamento...");
  try{
    // chama backend para criar pagamento
    const resp = await fetch(`${BACKEND}/create_payment?method=${method}`, {
      method:"POST",
      headers:{ "Content-Type":"application/json" },
      body: JSON.stringify({
        amount, description: `Açaí por peso - ${UNIT_NAME}`
      })
    });

    if(!resp.ok){
      const text = await resp.text();
      alert("Erro criando pagamento: "+text);
      return;
    }

    const data = await resp.json();
    // data deve conter { qr_url: "...", checkout_url: "...", id: "..." } dependendo do seu backend
    // mostramos QR se existir, ou encaminhamos para checkout_url
    if(data.qr_url){
      qrWrap.innerHTML = `<img src="${data.qr_url}" alt="QR Code" style="max-width:260px">`;
      qrWrap.classList.remove("hidden");
      showToast("Leia o QR Code com o celular.");
    } else if(data.checkout_url){
      window.open(data.checkout_url, "_blank");
      payModal.classList.add("hidden");
      showToast("Abrindo checkout...");
    } else {
      alert("Pagamento criado — verifique seu backend. Resposta:\n" + JSON.stringify(data));
    }
  }catch(err){
    alert("Erro de rede: " + (err.message||err));
  }
}

// linkar botões de pagamento
optDebit.addEventListener("click", ()=>createPayment("debit"));
optCredit.addEventListener("click", ()=>createPayment("credit"));
optPix.addEventListener("click", ()=>createPayment("pix"));

// toast
function showToast(msg, timeout=2200){
  toast.innerText = msg;
  toast.classList.remove("hidden");
  setTimeout(()=>toast.classList.add("hidden"), timeout);
}

/* ---------- proteção das páginas Configurações e Relatório ----------
   Queremos: NÃO exigir senha ao abrir o PDV, mas exigir senha (1901)
   quando usuário clicar em Configurações ou Relatório.
*/
const PASSWORD = "1901";

btnConfig.addEventListener("click", ()=>{
  const pass = prompt("Senha de Configurações:");
  if(pass === PASSWORD){
    // abrir uma página de configurações "simples" em nova janela (ou podemos abrir modal)
    // como não temos arquivo separado aqui, abrimos um small modal com os campos
    openConfigModal();
  } else {
    alert("Senha incorreta.");
  }
});

btnReport.addEventListener("click", ()=>{
  const pass = prompt("Senha para Relatório:");
  if(pass === PASSWORD) {
    openReportModal();
  } else {
    alert("Senha incorreta.");
  }
});

/* Modal simples para Configurações (inline) */
function openConfigModal(){
  const cont = document.createElement("div");
  cont.style.position="fixed";
  cont.style.left="0";cont.style.top="0";cont.style.right="0";cont.style.bottom="0";
  cont.style.background="rgba(0,0,0,0.5)";
  cont.style.display="flex";cont.style.alignItems="center";cont.style.justifyContent="center";
  cont.style.zIndex=2000;

  const box = document.createElement("div");
  box.style.background="#fff";box.style.color="#111";box.style.padding="20px";box.style.borderRadius="12px";
  box.style.width="360px";box.style.maxWidth="92%";
  box.innerHTML = `
    <h3 style="margin:0 0 12px 0">Configurações</h3>
    <label style="display:block;margin-bottom:8px">Nome da unidade</label>
    <input id="cfgUnit" type="text" style="width:100%;padding:8px;border-radius:8px;margin-bottom:12px" value="${UNIT_NAME}">
    <label style="display:block;margin-bottom:8px">Preço por 100g padrão</label>
    <input id="cfgPrice" type="text" style="width:100%;padding:8px;border-radius:8px;margin-bottom:12px" value="${priceInput.value}">
    <div style="display:flex;gap:8px;justify-content:flex-end">
      <button id="cfgCancel" style="padding:8px 12px;border-radius:8px">Cancelar</button>
      <button id="cfgSave" style="padding:8px 12px;border-radius:8px;background:#5A189A;color:#fff">Salvar</button>
    </div>
  `;
  cont.appendChild(box);
  document.body.appendChild(cont);

  document.getElementById("cfgCancel").addEventListener("click", ()=>cont.remove());
  document.getElementById("cfgSave").addEventListener("click", ()=>{
    const newUnit = document.getElementById("cfgUnit").value.trim() || UNIT_NAME;
    const newPrice = document.getElementById("cfgPrice").value.trim() || priceInput.value;
    unitNameEl.innerText = newUnit;
    priceInput.value = newPrice;
    updateTotalUI();
    cont.remove();
    showToast("Configurações salvas");
  });
}

/* Modal simples para Relatório */
function openReportModal(){
  const cont = document.createElement("div");
  cont.style.position="fixed";
  cont.style.left="0";cont.style.top="0";cont.style.right="0";cont.style.bottom="0";
  cont.style.background="rgba(0,0,0,0.5)";
  cont.style.display="flex";cont.style.alignItems="center";cont.style.justifyContent="center";
  cont.style.zIndex=2000;

  const box = document.createElement("div");
  box.style.background="#fff";box.style.color="#111";box.style.padding="20px";box.style.borderRadius="12px";
  box.style.width="680px";box.style.maxWidth="96%";
  box.innerHTML = `
    <h3 style="margin:0 0 12px 0">Relatório de Vendas (simulado)</h3>
    <div id="relList" style="min-height:120px;border:1px solid #eee;padding:10px;border-radius:8px">
      Nenhuma venda registrada (integre seu backend para registro em produção).
    </div>
    <div style="display:flex;gap:8px;justify-content:flex-end;margin-top:12px">
      <button id="relClose" style="padding:8px 12px;border-radius:8px">Fechar</button>
      <button id="relExport" style="padding:8px 12px;border-radius:8px;background:#5A189A;color:#fff">Exportar PDF</button>
    </div>
  `;
  cont.appendChild(box);
  document.body.appendChild(cont);

  document.getElementById("relClose").addEventListener("click", ()=>cont.remove());
  document.getElementById("relExport").addEventListener("click", ()=>{
    alert("Exportar PDF — implemente no backend para gerar relatórios reais.");
  });
}

/* Inicializa UI */
updateTotalUI();
