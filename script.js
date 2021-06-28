// Explicação de cada linha do JavaScript com comentários

// selecionando todos os elementos necessários
const selectBox = document.querySelector(".select-box"),
selectBtnX = selectBox.querySelector(".options .playerX"),
selectBtnO = selectBox.querySelector(".options .playerO"),
playBoard = document.querySelector(".play-board"),
jogadores = document.querySelector(".jogadores"),
allBox = document.querySelectorAll("section span"),
resultBox = document.querySelector(".result-box"),
wonText = resultBox.querySelector(".won-text"),
replayBtn = resultBox.querySelector("button");

window.onload = ()=>{ // uma vez que a janela é carregada
    for (let i = 0; i < allBox.length; i++) { // adiciona o atributo onclick em todo o intervalo disponível
       allBox[i].setAttribute("onclick", "clickedBox(this)");
    }
}

selectBtnX.onclick = ()=>{
    selectBox.classList.add("hide"); //ocultar caixa de seleção
    playBoard.classList.add("show"); //mostre a seção do playboard
}

selectBtnO.onclick = ()=>{ 
    selectBox.classList.add("hide"); //ocultar caixa de seleção
    playBoard.classList.add("show"); //mostre a seção do playboard
    jogadores.setAttribute("class", "jogadores active player"); //definir o atributo de classe em jogadores com valores e jogadores ativos
}

let playerXIcon = "fas fa-times"; //nome da classe do ícone de X
let playerOIcon = "far fa-circle"; //nome da classe do ícone do O
let jogadoresign = "X"; //esta é uma variável global porque usamos esta variável dentro de várias funções
let runBot = true; //esta também é uma variável global com valor boolen .. usamos esta variável para parar o bot uma vez que o jogo foi ganho por alguém ou empatado

// função de clique do usuário
function clickedBox(element){
    if(jogadores.classList.contains("player")){
        jogadoresign = "O"; //se o jogador escolher (O), então mude a opção para O
        element.innerHTML = `<i class="${playerOIcon}"></i>`; //adicionar etiqueta de ícone de círculo dentro do elemento quando clicado pelo usuário
        jogadores.classList.add("active"); ///add active class in jogadores
        element.setAttribute("id", jogadoresign); //set id attribute in span/box with player choosen sign
    }else{
        element.innerHTML = `<i class="${playerXIcon}"></i>`; //adding cross icon tag inside user clicked element/box
        jogadores.classList.add("active"); //add active class in jogadores
        element.setAttribute("id", jogadoresign); //set id attribute in span/box with player choosen sign
    }
    selectWinner(); //caliing selectWinner function
    element.style.pointerEvents = "none"; //once user select any box then that box can'be clicked again
    playBoard.style.pointerEvents = "none"; //add pointerEvents none to playboard so user can't immediately click on any other box until bot select
    let randomTimeDelay = ((Math.random() * 1000) + 200).toFixed(); //generating random number so bot will randomly delay to select unselected box
    setTimeout(()=>{
        bot(); //calling bot function
    }, randomTimeDelay); //passing random delay value
}

// bot auto select function
function bot(){
    let array = []; //creating empty array...we'll store unclicked boxes index
    if(runBot){ //if runBot is true
        jogadoresign = "O"; //change the jogadoresign to O so if player has chosen X then bot will O
        for (let i = 0; i < allBox.length; i++) {
            if(allBox[i].childElementCount == 0){ //if the box/span has no children means <i> tag
                array.push(i); //inserting unclicked boxes number/index inside array
            }
        }
        let randomBox = array[Math.floor(Math.random() * array.length)]; //getting random index from array so bot will select random unselected box
        if(array.length > 0){ //if array length is greater than 0
            if(jogadores.classList.contains("player")){ 
                jogadoresign = "X"; //if player has chosen O then bot will X
                allBox[randomBox].innerHTML = `<i class="${playerXIcon}"></i>`; //adding cross icon tag inside bot selected element
                jogadores.classList.remove("active"); //remove active class in jogadores
                allBox[randomBox].setAttribute("id", jogadoresign); //set id attribute in span/box with player choosen sign
            }else{
                allBox[randomBox].innerHTML = `<i class="${playerOIcon}"></i>`; //adding circle icon tag inside bot selected element
                jogadores.classList.remove("active"); //remove active class in jogadores
                allBox[randomBox].setAttribute("id", jogadoresign); //set id attribute in span/box with player choosen sign
            }
            selectWinner(); //chamando a função selectWinner
        }
        allBox[randomBox].style.pointerEvents = "none"; //uma vez que o bot selecione qualquer caixa, o usuário não poderá clicar nessa caixa
        playBoard.style.pointerEvents = "auto"; //adicionar pointerEvents no playboard para que o usuário possa clicar novamente na caixa
        jogadoresign = "X"; //se o jogador escolheu X então o bot será O certo então nós mudamos o jogadorign novamente para X então o usuário irá X porque acima nós mudamos o jogadorign para O para bot
    }
}

function getIdVal(classname){
    return document.querySelector(".box" + classname).id; 
}
function checkIdSign(val1, val2, val3, sign){ //verificar se todos os valores de id são iguais ao sinal (X ou O)
    if(getIdVal(val1) == sign && getIdVal(val2) == sign && getIdVal(val3) == sign){
        return true;
    }
}
function selectWinner(){ //se a seguinte combinação vencedora corresponder, selecione o vencedor
    if(checkIdSign(1,2,3,jogadoresign) || checkIdSign(4,5,6, jogadoresign) || checkIdSign(7,8,9, jogadoresign) || checkIdSign(1,4,7, jogadoresign) || checkIdSign(2,5,8, jogadoresign) || checkIdSign(3,6,9, jogadoresign) || checkIdSign(1,5,9, jogadoresign) || checkIdSign(3,5,7, jogadoresign)){
        runBot = false; //passing the false boolen value to runBot so bot won't run again
        bot(); //calling bot function
        setTimeout(()=>{ //após a partida vencida por alguém, então esconda o playboard e mostre a caixa de resultado após 700ms
            resultBox.classList.add("show");
            playBoard.classList.remove("show");
        }, 700); //1s = 1000ms
        wonText.innerHTML = `Jogador ${jogadoresign} ganhou o jogo!`; //exibindo o texto vencedor com o jogador (X ou O)
    }else{ //se todas as caixas tiverem valor de id e ainda assim ninguém vencer, a partida será empate
        if(getIdVal(1) != "" && getIdVal(2) != "" && getIdVal(3) != "" && getIdVal(4) != "" && getIdVal(5) != "" && getIdVal(6) != "" && getIdVal(7) != "" && getIdVal(8) != "" && getIdVal(9) != ""){
            runBot = false; //passando o valor boolen falso para runBot para que o bot não execute novamente
            bot(); //chamando função de bot
            setTimeout(()=>{ //após o sorteio da partida, oculte o tabuleiro e mostre a caixa de resultados após 0.7s
                resultBox.classList.add("show");
                playBoard.classList.remove("show");
            }, 700); //1s = 1000ms
            wonText.textContent = "Empate!"; //exibindo texto empate no jogo
        }
    }
}

replayBtn.onclick = ()=>{
    window.location.reload(); //recarregar a página atual ao clicar no botão de restart
}