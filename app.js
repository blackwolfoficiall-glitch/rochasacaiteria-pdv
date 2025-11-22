/* ----- ELEMENTOS ----- */
const weightEl = document.getElementById("weight");
const totalEl = document.getElementById("total");
const priceInput = document.getElementById("price100");
const btnConnect = document.getElementById("connectScale");
const btnCharge = document.getElementById("charge");
const nomeUnidadeEl = document.getElementById("nomeUnidade");

let grams = 0;

/* ----- FORMATADOR ----- */
function formatBRL(n){
    return 'R$ ' + Number(n).toLocaleString('pt-BR', {minimumFractionDigits:2});
}

/* ----- CARREGAR PREÇO + UNIDADE ----- */
window.onload = () => {
    const precoSalvo = localStorage.getItem("preco100") || "5,00";
    const unidadeSalva = localStorage.getItem("unidade") || "";

    priceInput.value = precoSalvo;
    nomeUnidadeEl.innerText = unidadeSalva;
    atualizarTotal();
};

/* ----- ATUALIZAR TOTAL ----- */
function atualizarTotal(){
    let preco = parseFloat(priceInput.value.replace(",", "."));
    if(isNaN(preco)) preco = 0;

    const total = (grams / 100) * preco;
    totalEl.textContent = formatBRL(total);
}

/* ----- PREÇO ALTERADO ----- */
priceInput.addEventListener("input", atualizarTotal);

/* ----- CONECTAR BALANÇA ----- */
btnConnect.addEventListener("click", async () => {
    try{
        const port = await navigator.serial.requestPort();
        await port.open({ baudRate: 9600 });

        btnConnect.style.display = "none";

        let reader = port.readable.getReader();

        while(true){
            const { value, done } = await reader.read();
            if(done) break;

            const texto = new TextDecoder().decode(value);
            const numero = parseInt(texto);

            if(!isNaN(numero)){
                grams = numero;
                weightEl.textContent = grams + " g";
                atualizarTotal();
            }
        }

    }catch(err){
        alert("Erro ao conectar na balança.");
    }
});

/* ----- COBRAR ----- */
btnCharge.addEventListener("click", () => {
    if(grams <= 0){
        alert("Peso inválido.");
        return;
    }

    alert("Cobrança enviada para o backend.");
});
