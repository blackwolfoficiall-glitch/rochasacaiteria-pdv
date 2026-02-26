function mostrarTela(id) {
document.querySelectorAll('.tela').forEach(tela => {
tela.classList.remove('ativa');
});
document.getElementById(id).classList.add('ativa');
}

function irParaTelefone() {
mostrarTela('telaTelefone');
}

function irParaPeso() {
const tel = document.getElementById('telefone').value;
if (tel.length < 8) {
alert('Digite um telefone válido');
return;
}
mostrarTela('telaPeso');
}

function irParaPagamento() {
mostrarTela('telaPagamento');
}

function confirmarPagamento() {
mostrarTela('telaAvaliacao');

// volta automático após 3 segundos
setTimeout(() => {
finalizar();
}, 3000);
}

function finalizar() {
document.getElementById('telefone').value = '';
mostrarTela('telaInicio');
}
