// Carregar vendas do localStorage
let vendas = JSON.parse(localStorage.getItem("vendas")) || [];

// Mostrar vendas na tela
const lista = document.getElementById("listaRelatorio");

if (vendas.length === 0) {
    lista.innerHTML = "Nenhuma venda hoje.";
} else {
    lista.innerHTML = vendas
        .map(v => `<p>${v.horario} — ${v.peso} kg — R$ ${v.total}</p>`)
        .join("");
}

// EXPORTAR PDF
document.getElementById("btnExportPdf").addEventListener("click", () => {
    const conteudo = lista.innerHTML;

    const janela = window.open("", "_blank");
    janela.document.write(`
        <html><head><title>Relatório Rochas Açaí</title></head><body>
        <h1>Relatório de Vendas - Rochas Açaí</h1>
        ${conteudo}
        </body></html>
    `);
    janela.print();
});
