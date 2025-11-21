let preco100 = localStorage.getItem("preco100") || 5.49;
let unidade = localStorage.getItem("unidade") || "Ilha 9";
let peso = 0;

// Exibir na tela
document.getElementById("unidadeNome").innerText = "Unidade " + unidade;
document.getElementById("preco100g").innerText = "R$ " + preco100 + " / 100g";

// --- Simulação de peso (depois substituímos pela balança REAL)
setInterval(() => {
    peso = (Math.random() * 0.700).toFixed(3); // 0 a 700g
    mostrarPeso();
}, 1500);

function mostrarPeso() {
    document.getElementById("pesoValor").innerText = (peso * 1000).toFixed(0) + " g";

    let total = (peso * (preco100 / 0.1)).toFixed(2);
    document.getElementById("precoValor").innerText = "R$ " + total;
}

function cobrar() {
    alert("Pagamento futuramente integrado ×");
}

function abrirConfig() {
    mudarTela("tela-config");
    document.getElementById("inputPreco").value = preco100;
    document.getElementById("inputUnidade").value = unidade;
}

function salvarConfig() {
    preco100 = document.getElementById("inputPreco").value;
    unidade = document.getElementById("inputUnidade").value;

    localStorage.setItem("preco100", preco100);
    localStorage.setItem("unidade", unidade);

    location.reload();
}

function exportar() {
    alert("Relatório será gerado futuramente ✓");
}

function voltar() {
    mudarTela("tela-peso");
}

function mudarTela(id) {
    document.querySelectorAll(".tela").forEach(t => t.classList.remove("ativa"));
    document.getElementById(id).classList.add("ativa");
}
