// ====== Configurações iniciais ======
let precoPor100g = Number(localStorage.getItem('preco')) || 5.49;
let unidadeNome = localStorage.getItem('unidade') || 'Unidade Ilha 9';

// atualiza o texto da unidade (header)
document.addEventListener('DOMContentLoaded', () => {
  const elUn = document.getElementById('unidade');
  if (elUn) elUn.innerText = unidadeNome;
});

// função que atualiza os valores na tela
function atualizarDisplay(pesoKg){
  // pesoKg = número em kg
  let total = pesoKg * (precoPor100g * 10); // 100g = precoPor100g; 1kg = *10
  const pesoEl = document.getElementById('pesoDisplay');
  const totalEl = document.getElementById('totalDisplay');
  const precoEl = document.getElementById('precoInfo');

  if(pesoEl) pesoEl.innerText = pesoKg.toFixed(3) + ' kg';
  if(totalEl) totalEl.innerText = 'R$ ' + total.toFixed(2);
  if(precoEl) precoEl.innerText = 'R$ ' + precoPor100g.toFixed(2) + ' / 100g';
}

// ===== Simulação de peso (substituir depois pelo read da balança) =====
setInterval(()=>{
  const pesoFake = Math.random() * 0.8; // 0 - 800g
  atualizarDisplay(pesoFake);
}, 900);

// ===== Botão COBRAR =====
document.addEventListener('click', (e)=>{
  if(!e.target) return;
  if(e.target.id === 'btnCobrar' || e.target.classList.contains('btn-cobrar')){
    // substituir por integração de pagamento
    alert('Iniciando pagamento...\n(implementação de integração depois)');
  }
});

// ===== Reatividade após salvar em config.html =====
// Quando voltar da página de config.html, o usuário salvou no localStorage.
// Verificamos localStorage a cada 800ms e atualizamos se houve mudança.
let lastPreco = precoPor100g;
let lastUnidade = unidadeNome;
setInterval(()=>{
  const p = Number(localStorage.getItem('preco')) || 5.49;
  const u = localStorage.getItem('unidade') || 'Unidade Ilha 9';
  if(p !== lastPreco || u !== lastUnidade){
    precoPor100g = p;
    unidadeNome = u;
    const elU = document.getElementById('unidade');
    if(elU) elU.innerText = unidadeNome;
    // forçar uma atualização de display (mantemos último peso mostrado ou usa 0)
    // extrair peso atual do DOM (convenção): "0.532 kg"
    let pesoText = document.getElementById('pesoDisplay')?.innerText || '0.000 kg';
    let pesoVal = parseFloat(pesoText.replace('kg','').trim()) || 0;
    atualizarDisplay(pesoVal);
    lastPreco = p;
    lastUnidade = u;
  }
}, 700);
// === UTIL: salvar venda (exemplo) ===
// Chame saveSale({peso, total, data}) quando confirmar venda no botão "Cobrar"
function saveSale(sale) {
  const raw = localStorage.getItem('vendas');
  const arr = raw ? JSON.parse(raw) : [];
  arr.push(sale);
  localStorage.setItem('vendas', JSON.stringify(arr));
}

// === Gerar PDF (jsPDF) ===
async function generateSalesPDF() {
  // pega vendas do localStorage
  const raw = localStorage.getItem('vendas');
  const vendas = raw ? JSON.parse(raw) : [];

  // usa jsPDF
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "pt",
    format: "a4"
  });

  const title = "Relatório de Vendas - Rochas Açaí";
  const today = new Date().toLocaleString();

  let y = 40;
  doc.setFontSize(18);
  doc.text(title, 40, y);
  doc.setFontSize(10);
  doc.text("Gerado em: " + today, 40, y + 18);
  y += 40;

  if (vendas.length === 0) {
    doc.setFontSize(12);
    doc.text("Nenhuma venda hoje.", 40, y);
  } else {
    doc.setFontSize(12);
    // cabeçalho coluna
    doc.text("Nº", 40, y);
    doc.text("Peso (kg)", 80, y);
    doc.text("Total (R$)", 200, y);
    doc.text("Data", 320, y);
    y += 18;

    vendas.forEach((v, i) => {
      if (y > 740) { // nova página
        doc.addPage();
        y = 40;
      }
      doc.text(String(i+1), 40, y);
      doc.text(String(Number(v.peso).toFixed(3)), 80, y);
      doc.text("R$ " + Number(v.total).toFixed(2), 200, y);
      doc.text(v.data || '-', 320, y);
      y += 16;
    });

    // soma
    const sum = vendas.reduce((s, v) => s + Number(v.total || 0), 0);
    y += 20;
    doc.setFontSize(14);
    doc.text("Total do dia: R$ " + sum.toFixed(2), 40, y);
  }

  // gerar nome do arquivo
  const filename = `Relatorio_RochasAçai_${(new Date()).toISOString().slice(0,10)}.pdf`;

  // baixa automaticamente
  doc.save(filename);

  // Retorna o blob (se quiser subir ao servidor)
  // const blob = doc.output('blob');
  // return { doc, blob, filename };
}

// === Abrir WhatsApp Web com texto pronto ===
function openWhatsAppWithMessage(phoneNumber) {
  const raw = localStorage.getItem('vendas') || '[]';
  const vendas = JSON.parse(raw);
  const sum = vendas.reduce((s, v) => s + Number(v.total || 0), 0).toFixed(2);

  let text = `Relatório Rochas Açaí\nTotal de vendas: R$ ${sum}\nQuantidade de vendas: ${vendas.length}\n`;
  text += `Abra o PDF gerado e anexe às mensagens se desejar.`;

  // URL encode
  const encoded = encodeURIComponent(text);
  // phoneNumber no formato internacional sem + (ex: 55 75 983748041 -> 5575983748041)
  const url = `https://wa.me/${phoneNumber}?text=${encoded}`;
  window.open(url, '_blank');
}

// === Abrir mailto com texto (não anexa PDF automaticamente) ===
function openEmailWithMessage(emailAddress) {
  const raw = localStorage.getItem('vendas') || '[]';
  const vendas = JSON.parse(raw);
  const sum = vendas.reduce((s, v) => s + Number(v.total || 0), 0).toFixed(2);

  const subject = encodeURIComponent("Relatório Rochas Açaí - vendas");
  let body = `Olá,\n\nSegue relatório de vendas (PDF anexado manualmente).\nTotal do dia: R$ ${sum}\nVendas: ${vendas.length}\n\nAtenciosamente,\nRochas Açaí`;
  body = encodeURIComponent(body);

  window.location.href = `mailto:${emailAddress}?subject=${subject}&body=${body}`;
}
