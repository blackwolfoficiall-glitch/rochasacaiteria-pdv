* {
margin: 0;
padding: 0;
box-sizing: border-box;
font-family: Arial, sans-serif;
}

body {
background: linear-gradient(135deg, #3a0b63, #6a1bb1);
color: #fff;
height: 100vh;
}

.tela {
display: none;
height: 100vh;
width: 100%;
padding: 40px 20px;
text-align: center;

display: flex;
flex-direction: column;
align-items: center;
justify-content: center;
}

.tela.ativa {
display: flex;
}

/* LOGO AJUSTADA + SOMBRA */
.logo {
width: 180px;
max-width: 70%;
height: auto;
margin-bottom: 25px;
object-fit: contain;
filter: drop-shadow(0 6px 12px rgba(0,0,0,0.35));
}

/* TEXTOS */
h1 {
font-size: 34px;
margin-bottom: 10px;
}

h2 {
font-size: 28px;
margin-bottom: 20px;
}

p {
font-size: 16px;
opacity: 0.9;
margin-bottom: 20px;
}

/* INPUT */
input {
width: 80%;
max-width: 300px;
padding: 15px;
font-size: 18px;
border-radius: 8px;
border: none;
text-align: center;
margin-bottom: 20px;
}

/* BOTÃO */
button {
background: #ffd600;
color: #000;
border: none;
border-radius: 10px;
padding: 15px 40px;
font-size: 18px;
font-weight: bold;
cursor: pointer;
}

button:active {
transform: scale(0.97);
}

/* PESO */
.peso {
font-size: 42px;
font-weight: bold;
margin: 20px 0;
}

/* AVALIAÇÃO */
.avaliacao span {
font-size: 40px;
margin: 10px;
cursor: pointer;
}
