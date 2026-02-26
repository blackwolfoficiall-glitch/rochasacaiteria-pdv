let venda = {
  telefone: '',
  peso: 0,
  valor: 0,
  avaliacao: null,
  horario: null
};

const precoPorGrama = 0.05; // ajuste aqui

function mostrarTela(id) {
  document.querySelectorAll('.tela').forEach(t => t.classList.remove('ativa'));
  document.getElementById(id).classList.add('ativa');
}

function irTelefone() {
  mostrarTela('tela-telefone');
}

function confirmarTelefone() {
  const tel = document.getElementById('telefone').value;
  if (tel.length < 10) return alert('Telefone inválido');
  venda.telefone = tel;
  iniciarPesagem();
}

function iniciarPesagem() {
  mostrarTela('tela-pesagem');

  // SIMULA leitura da balança (substituir pela real)
  setTimeout(() => {
    venda.peso = Math.floor(Math.random() * 500) + 200;
    venda.valor = (venda.peso * precoPorGrama).toFixed(2);

    document.getElementById('peso').innerText = `Peso: ${venda.peso} g`;
    document.getElementById('valor').innerText = `Valor: R$ ${venda.valor}`;
  }, 1500);
}

function irPagamento() {
  document.getElementById('valor-final').innerText = `R$ ${venda.valor}`;
  mostrarTela('tela-pagamento');

  // timeout de segurança (30s)
  setTimeout(resetSistema, 30000);
}

function confirmarPagamento() {
  venda.horario = new Date().toISOString();
  salvarVenda();
  mostrarTela('tela-sucesso');

  setTimeout(() => {
    mostrarTela('tela-avaliacao');
    setTimeout(resetSistema, 5000);
  }, 3000);
}

function avaliar(nota) {
  venda.avaliacao = nota;
  salvarVenda();
  resetSistema();
}

function salvarVenda() {
  let vendas = JSON.parse(localStorage.getItem('vendas')) || [];
  vendas.push(venda);
  localStorage.setItem('vendas', JSON.stringify(vendas));
}

function resetSistema() {
  venda = {};
  document.getElementById('telefone').value = '';
  document.getElementById('peso').innerText = 'Peso: -- g';
  document.getElementById('valor').innerText = 'Valor: R$ --';
  mostrarTela('tela-inicial');
}

// inicia
mostrarTela('tela-inicial');
