// Carrega vendas
let vendas = JSON.parse(localStorage.getItem("vendasDia")) || [];

const divLista = document.getElementById("listaVendas");

if (vendas.length === 0) {
    divLista.innerHTML = "Nenhuma venda hoje.";
} else {
    divLista.innerHTML = vendas.map(v => `
        <p>${v.hora} — ${v.peso}kg — R$ ${v.total}</p>
    `).join("");
}

// ---- EXPORTAR PDF ----
document.getElementById("btnExportarPDF").addEventListener("click", () => {

    let conteudoPDF = `
RELATÓRIO ROCHAS AÇAÍ
-------------------------

Vendas de hoje:

${vendas.map(v => `${v.hora} - ${v.peso}kg - R$ ${v.total}`).join("\n")}
`;

    let blob = new Blob([conteudoPDF], { type: "application/pdf" });
    let link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "Relatorio_Rochas_Acai.pdf";
    link.click();
});
