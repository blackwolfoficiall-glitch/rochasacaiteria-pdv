// Carregar valores salvos
document.getElementById("inputPreco").value = localStorage.getItem("preco") || "5.49";
document.getElementById("inputUnidade").value = localStorage.getItem("unidade") || "Ilha 9";

// Botão salvar
document.getElementById("btnSalvar").addEventListener("click", () => {
    
    let preco = document.getElementById("inputPreco").value.replace(",", ".");
    let unidade = document.getElementById("inputUnidade").value;

    if (!preco || isNaN(preco)) {
        alert("Digite um preço válido!");
        return;
    }

    localStorage.setItem("preco", preco);
    localStorage.setItem("unidade", unidade);

    alert("Configurações salvas!");
    window.location.href = "index.html";  // Voltar ao PDV
});
