// Carregar configurações salvas
document.getElementById("inputPreco").value =
    localStorage.getItem("preco") || "5.49";

document.getElementById("inputUnidade").value =
    localStorage.getItem("unidade") || "Ilha 9";

// Botão salvar
document.getElementById("btnSalvar").addEventListener("click", () => {
    const preco = document.getElementById("inputPreco").value;
    const unidade = document.getElementById("inputUnidade").value;

    localStorage.setItem("preco", preco);
    localStorage.setItem("unidade", unidade);

    alert("Configurações salvas!");
});
