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
