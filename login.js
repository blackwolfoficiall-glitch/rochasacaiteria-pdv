/* Login PDV - senha 1901 */
const SENHA_CORRETA = "1901";

const campo = document.getElementById("senha");
const btn = document.getElementById("btnLogin");
const msg = document.getElementById("msg");

btn.addEventListener("click", autenticar);
campo.addEventListener("keypress", (e)=>{
    if(e.key === "Enter") autenticar();
});

function autenticar(){
    if(campo.value === SENHA_CORRETA){
        localStorage.setItem("logado", "sim");
        window.location.href = "index.html";
    } else {
        msg.innerText = "Senha incorreta!";
        msg.style.color = "red";
        campo.value = "";
    }
}
