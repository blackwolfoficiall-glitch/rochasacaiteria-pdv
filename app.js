function resetarSistema() {
  document.querySelectorAll(".tela").forEach(tela => {
    tela.classList.remove("ativa");
  });

  document.getElementById("tela-telefone").classList.add("ativa");

  telefoneCliente = "";
  pesoAtual = 0;
  valorFinal = 0;
  avaliacaoCliente = 0;
}
