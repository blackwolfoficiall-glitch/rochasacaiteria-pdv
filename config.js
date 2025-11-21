// Carregar valores existentes
document.getElementById("precoInput").value = localStorage.getItem("preco") || "5.49";
document.getElementById("unidadeInput").value = localStorage.getItem("unidade") || "Ilha 9";

// Botão salvar
document.getElementById("btnSalvar").addEventListener("click", () => {
    
    let novoPreco = document.getElementById("precoInput").value;
    let novaUnidade = document.getElementById("unidadeInput").value;

    localStorage.setItem("preco", novoPreco);
    localStorage.setItem("unidade", novaUnidade);

    alert("Configurações salvas!");

    window.location.href = "index.html";
});
