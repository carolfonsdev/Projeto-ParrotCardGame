let jogador = prompt("Qual é seu nome?"); // guarda jogador
let numCartas = Number(prompt(`${jogador} com quantas cartas deseja jogar?`)); // pergunta quantidade de cartas e guarda (valida se o nome foi inserido)

let jogadas = 0;
let paresEncontrados = 0;
let primeiraCartaVirada = null;
let segundaCartaVirada = null;
let fimDeJogoVerificado = false; // Adicionada variável de controle

const tabuleiro = document.getElementById("tabuleiro"); // pega tabuleiro

const imagens = [
  "imagens/bobrossparrot.gif",
  "imagens/explodyparrot.gif",
  "imagens/fiestaparrot.gif",
  "imagens/metalparrot.gif",
  "imagens/revertitparrot.gif",
  "imagens/tripletsparrot.gif",
  "imagens/unicornparrot.gif",
];

// verificação inicial (valida o número de cartas inserido pelo jogador)
while (numCartas < 4 || numCartas > 14 || numCartas % 2 !== 0) {
  // enquanto "cartas escolhidas" forem menor que 4 que 14, maior ou um número ímpar
  alert("Digite um número par entre 4 e 14."); // alerta
  numCartas = Number(prompt("Com quantas cartas deseja jogar?")); // pergunta dnv
}
alert("Bem-vindo ao jogo! Boa sorte!"); // se não e estiver udo certinho, bem-vindo!

// criação duplicadas
function criarImagensDuplicadas(numCartas, imagens) {
  // numCartas e imagens estão como parâmetro para poder usar as variáveis globais na função
  const imagensDuplicadas = []; // criação de uma lista para armazenar as imagens duplicadas
  for (let i = 0; i < numCartas / 2; i++) {
    // para i = 0, se i for menor que a metade do numero de cartas....depois incremente +1 a i
    imagensDuplicadas.push(imagens[i]); // meu i sendo menor que a metade, pego a variável imagensDuplicadas e push(adiciono) imagens[i]
    imagensDuplicadas.push(imagens[i]); // repete
  }
  imagensDuplicadas.sort(() => Math.random() - 0.5); // embaralha as cartas
  return imagensDuplicadas; // retorna imagensDupicadas para ser usada em outros lugares
}

// criação cartas
function criarCartas(imagensDuplicadas, tabuleiro) {
  // pegamos imagensDuplicadas que retornamos e agora o tabuleiro também
  for (let i = 0; i < imagensDuplicadas.length; i++) {
    // para i = 0, se i for menor que o tamanho de imagensDuplicadas....depois incrementa +1 a i
    const carta = document.createElement("div"); // cria carta em div com classe carta
    carta.classList.add("carta");

    const cartaFrente = document.createElement("div"); // cria cartaFrnete em div com classe carta-frente
    cartaFrente.classList.add("carta-frente");

    const imagemFrente = document.createElement("img"); // cria imagemFrente, que é a imagem da carta frente em img e adiona o parrot com src e adicona um alt com nome caso nao seja carregado
    imagemFrente.src = "imagens/back.png";
    imagemFrente.alt = "Verso da Carta (padrão)";

    const cartaVerso = document.createElement("div"); // cria cartaVerso em div com classe carta-verso
    cartaVerso.classList.add("carta-verso");

    const imagemVerso = document.createElement("img"); // cria a imagemVerso, igual a imagemFrente, porém em src está a lista imagensDuplicadas
    imagemVerso.src = imagensDuplicadas[i];
    imagemVerso.alt = "Imagem da carta";

    cartaFrente.appendChild(imagemFrente); // imagemFrente filho cartFrente
    cartaVerso.appendChild(imagemVerso); // imagemVerso filho de cartaVerso
    carta.appendChild(cartaFrente); //cartaFrente filho de carta
    carta.appendChild(cartaVerso); // cartaVerso filho de carta
    tabuleiro.appendChild(carta); // carta filho de tabuleiro

    carta.addEventListener("click", () => {
      // adiconando click em carta
      if (
        // verifica se carta tem a classe virada (contains) OU se primeiraCartaVirada e segundaCartaVirada foram clicadas, já que foram criadas como null, está verificando se já foram selecionadas
        carta.classList.contains("carta-virada") ||
        (primeiraCartaVirada && segundaCartaVirada)
      ) {
        // se true return parafinalizar addEventListenner
        return;
      } // se false adiconar a classe virada na carta clicada
      carta.classList.add("carta-virada");

      if (!primeiraCartaVirada) {
        // se a primeiraCarta nao foi clicada, nenhuma carta ainda
        primeiraCartaVirada = carta; // a primeira vai ser adionada
      } else {
        // se não, se já foi clicada a primeira carta
        segundaCartaVirada = carta; // adionar a segunda
        verificarPares(); // chama a função de verificar pares
      }
    });
  }
}

function verificarPares() {
  // verifica se as cartas foram selecionadas ou nao, se nao foram ele para com return (evitando erros caso as cartas não existam mais)
  if (!primeiraCartaVirada || !segundaCartaVirada) {
    return;
  }

  // variável agora da imagemPrimeiraCarta que vai pegar .carta-verso img (nossas imagens aqui no js) e o ".src" pega o caminho da imagem
  const imagemPrimeiraCarta =
    primeiraCartaVirada.querySelector(".carta-verso img").src;
  // mesma coisa com a segunda
  const imagemSegundaCarta =
    segundaCartaVirada.querySelector(".carta-verso img").src;

  // adicionar numero de jogadas (a cada par virado)
  jogadas++;

  // se a Imagem 1 for IGUAL a Imagem 2, adionar para paresEncontrados (1)
  if (imagemPrimeiraCarta === imagemSegundaCarta) {
    paresEncontrados++;
    primeiraCartaVirada = null; // depois disso, vai esvaziar a variavel primeiraCartaVirada
    segundaCartaVirada = null; // mesma coisa na segundaCartaVirada
    verificarFimDeJogo();
  } else {
    // se elas não forem iguais
    setTimeout(() => {
      primeiraCartaVirada.classList.remove("carta-virada"); // vai remover a classe carta-virada
      segundaCartaVirada.classList.remove("carta-virada"); // mesma coisa na segundaCarta
      primeiraCartaVirada = null; // e vai esvaziar as duas variaveis de primeiraCartaVirada
      segundaCartaVirada = null; // mesma coisa aqui na segundaCartaVirada
    }, 1000); // espera 1 segundo para desvirar as cartas
  }
}

function verificarFimDeJogo() {
  // vai verificar o fim do jogo
  if (fimDeJogoVerificado) {
    return; // Impede chamadas duplicadas
  }

  if (paresEncontrados === numCartas / 2) {
    // se os paresEncontrados forem IGUAIS a metade da quantidade de cartas
    fimDeJogoVerificado = true;
    setTimeout(() => {
      // espera 0.5 segundos para exibir a mensagem de vitória
      const reiniciar = confirm(
        `Parabéns, ${jogador}! Você venceu em ${jogadas} jogadas! Deseja jogar novamente?`
      );
      if (reiniciar) {
        // se sim, vai chamar a função reniniarJogo
        reiniciarJogo();
      }
    }, 500);
  }
}

function reiniciarJogo() {
  // função para reiniciar o jogo, limpando o tabuleiro e as variáveis, e solicitando um novo número de cartas
  tabuleiro.innerHTML = ""; // limpa o conteúdo do tabuleiro
  jogadas = 0; // limpa o numero de jogadas
  paresEncontrados = 0; // limpa os paresEncontrados
  primeiraCartaVirada = null; // limpa primeiraCartaVirada
  segundaCartaVirada = null; // limpa segundaCartaVirada
  fimDeJogoVerificado = false; // reinicia a variável de controle do fim do jogo

  numCartas = Number(prompt("Com quantas cartas deseja jogar?")); // solicita o número de cartas para a próxima rodada
  while (numCartas < 4 || numCartas > 14 || numCartas % 2 !== 0) {
    alert("Digite um número par entre 4 e 14");
    numCartas = Number(prompt("Com quantas cartas deseja jogar?"));
  }

  const imagensDuplicadas = criarImagensDuplicadas(numCartas, imagens);
  criarCartas(imagensDuplicadas, tabuleiro);
}

const imagensDuplicadas = criarImagensDuplicadas(numCartas, imagens);
criarCartas(imagensDuplicadas, tabuleiro);