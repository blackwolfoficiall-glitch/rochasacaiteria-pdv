const vendas = JSON.parse(localStorage.getItem("vendas")) || [];

document.getElementById("total").innerText = vendas.length;

const total = vendas.reduce((s, v) => s + v.valor, 0);
document.getElementById("faturamento").innerText = "R$ " + total.toFixed(2);
document.getElementById("ticket").innerText =
  "R$ " + (total / (vendas.length || 1)).toFixed(2);

new Chart(document.getElementById("grafico"), {
  type: "bar",
  data: {
    labels: vendas.map(v => v.data),
    datasets: [{
      label: "Vendas",
      data: vendas.map(v => v.valor)
    }]
  }
});
