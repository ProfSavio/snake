const tabuleiro = document.querySelector(".tabuleiro");
const elementoPontuacao = document.querySelector(".pontuacao");
const elementoPontuacaoRecorde = document.querySelector(".pontuacao-recorde");
const controles = document.querySelectorAll(".controles i");

let gameOver = false;
let comidaX, comidaY;
let cobraX = 5, cobraY = 10;
let corpoCobra = [];
let velocidadeX = 0, velocidadeY = 0;
let pontuacao = 0;
let pontucaoRecorde = localStorage.getItem("pontuacao-recorde") || 0;
elementoPontuacaoRecorde.innerHTML = `Recorde: ${pontucaoRecorde}`;
let setIntervalId;

function iniciar() {
    if(gameOver) return tratarGameOver();

    let codigoHtml = `<div class="comida" style="grid-area: ${comidaY} / ${comidaX}"></div>`;

    // Verificar se a cobra comeu a comida
    if(cobraX === comidaX && cobraY === comidaY) {
        mudarPosicaoComida();
        corpoCobra.push([comidaX, comidaY]);
        pontuacao++;

        pontucaoRecorde = pontuacao >= pontucaoRecorde ? pontuacao : pontucaoRecorde;
        localStorage.setItem("pontuacao-recorde", pontucaoRecorde);
        elementoPontuacao.innerHTML = `Pontuação: ${pontuacao}`;
    }

    // Deslocar os pixels do corpo da cobra uma posição à frente, dando o efeito de movimento.
    for(let i = corpoCobra.length - 1; i > 0; i--) {
        corpoCobra[i] = corpoCobra[i - 1];
    }

    corpoCobra[0] = [cobraX, cobraY];
    cobraX += velocidadeX;
    cobraY += velocidadeY;

    // Definir limite da tela, dando game Over se a cobra bater nas paredes
    if(cobraX <= 0 || cobraX > 30 || cobraY <= 0 || cobraY > 30) {
        gameOver = true;
    }

    // Adiciona um novo elemento/pixel para cada parte do corpo da cobra
    for(let i = 0; i < corpoCobra.length; i++) {
        codigoHtml += `<div class="cobra" style="grid-area: ${corpoCobra[i][1]} / ${corpoCobra[i][0]}"></div>`;

        // Verifica se a cabeça da cobra bateu no corpo, e caso sim, já aplica o Game Over
        if(i !== 0 && corpoCobra[0][1] === corpoCobra[i][1] && corpoCobra[0][0] === corpoCobra[i][0]) {
            gameOver = true;
        }
    }
    
    tabuleiro.innerHTML = codigoHtml;

}

function mudarPosicaoComida() {
    comidaX = Math.floor(Math.random() * 30) + 1;
    comidaY = Math.floor(Math.random() * 30) + 1;
}

function mudarDirecao(e) {
    if(e.key === "ArrowUp" && velocidadeY != 1) {
        velocidadeX = 0;
        velocidadeY = -1;
    } else if(e.key === "ArrowDown" && velocidadeY != -1) {
        velocidadeX = 0;
        velocidadeY = 1;
    } else if(e.key === "ArrowLeft" && velocidadeX != 1) {
        velocidadeX = -1;
        velocidadeY = 0;
    } else if(e.key === "ArrowRight" && velocidadeX != -1) {
        velocidadeX = 1;
        velocidadeY = 0;
    }
}

controles.forEach(key => {
    key.addEventListener("click", () => mudarDirecao({ key: key.dataset.key }))
})

function tratarGameOver() {
    clearInterval(setIntervalId);
    alert("Game Over! Pressione OK para reiniciar...");
    location.reload();
}

mudarPosicaoComida();
setIntervalId = setInterval(iniciar, 125);
document.addEventListener("keydown", mudarDirecao);