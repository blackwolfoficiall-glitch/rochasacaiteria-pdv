let preco100 = 5.49; // preço por 100g
let pesoAtual = 0;

// Simulação de leitura da balança
setInterval(() => {
    // NUM REAL: Aqui entra o peso vindo da balança ESC POS / USB
    pesoAtual = (Math.random() * 500).toFixed(0); 
    atualizarTela();
}, 1200);

// atualiza interface
function atualizarTela() {
    document.getElementById("peso").textContent = pesoAtual + " g";
    
    let total = (pesoAtual / 100 * preco100);
    document.getElementById("total").textContent = "R$ " + total.toFixed(2).replace('.', ',');
    
    document.getElementById("precoAtual").textContent = preco100.toFixed(2).replace('.', ',');
}

// simula cobrança
function cobrar() {
    alert("Pagamento seria enviado aqui. Integração futura.");
}








