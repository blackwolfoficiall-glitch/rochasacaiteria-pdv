document.addEventListener("DOMContentLoaded",()=>{
const price=document.getElementById("inputPrice");
const unit=document.getElementById("inputUnit");
const save=document.getElementById("btnSave");

// carregar
const sP=localStorage.getItem("preco100");
const sU=localStorage.getItem("unidadeNome");

if(sP) price.value=sP;
if(sU) unit.value=sU;

// salvar
save.onclick=()=>{
 localStorage.setItem("preco100",price.value);
 localStorage.setItem("unidadeNome",unit.value);
 alert("Configurações salvas!");
 window.location.href="index.html";
};
});
