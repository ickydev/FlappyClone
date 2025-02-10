let borda;
let bordaLargura = 360;
let bordaAltura = 640;
let context;

// Passaro
let passaroLargura = 34;
let passaroAltura = 24;
let passaroX = bordaLargura / 8;
let passaroY = bordaAltura / 2;
let birdImgs = [];
let birdImgsIndex = 0;

// Flappy
let passaro ={
    x: passaroX,
    y: passaroY,
    largura: passaroLargura,
    altura: passaroAltura
}

// Canos
let canosArray = [];
let canoLargura = 64;
let canoAltura = 512;
let canoX = bordaLargura;
let canoY = 0;

let dificuldade = 2;

// Img
let canoCimaImg;
let canoBaixoImg;

// Física
let velocidadeX = -2 * dificuldade;
let velocidadeY = 0;
let gravidade = 0.4;

let gameOver = false;
let pontos = 0;

let asaSom = new Audio("./src/sounds/sfx_wing.wav");
let hitSom = new Audio("./src/sounds/sfx_hit.wav");
let pontoSom = new Audio("./src/sounds/sfx_point.wav");
let bgm = new Audio("./src/sounds/bgm_mario.mp3");
bgm.loop = true;

window.onload = () => {
    borda = document.getElementById("borda");
    borda.width = bordaLargura;
    borda.height = bordaAltura;
    context = borda.getContext("2d");

    //
    //birdImgs = new Image();
    //birdImgs.src = "/src/images/flappybird0.png";
    //birdImgs.onload = () => {
        //context.drawImage(birdImgs[birdImgsIndex], passaro.x, passaro.y, passaro.largura, passaro.altura);
    //}

    for(let i = 0; i < 4; i++){
        let birdImg = new Image();
        birdImg.src = "/src/images/flappybird" + i + ".png";
        birdImgs.push(birdImg);
    }

    canoCimaImg = new Image();
    canoCimaImg.src = "src/images/toppipe.png";

    canoBaixoImg = new Image();
    canoBaixoImg.src = "src/images/bottompipe.png";

    requestAnimationFrame(Update)
    setInterval(AdicionarCanos , 1500 / dificuldade);
    setInterval(AnimarPassaro , 100);
    document.addEventListener("keydown", MoverPassaro);
}

function Update(){
    requestAnimationFrame(Update);

    if(gameOver){
        return;
    }

    context.clearRect(0,0, borda.width, borda.height);

    // Flappy
    velocidadeY += gravidade;
    passaro.y += velocidadeY;
    passaro.y = Math.min(passaro.y, borda.height - passaro.altura);
    passaro.y = Math.max(passaro.y, 0);
    context.drawImage(birdImgs[birdImgsIndex], passaro.x, passaro.y, passaro.largura, passaro.altura);

    if(passaro.y == 0 || passaro.y == borda.height - passaro.altura){
        gameOver = true;
    }

    // Canos
    for(let i = 0; i < canosArray.length; i++){
        let cano = canosArray[i];
        cano.x += velocidadeX;
        context.drawImage(cano.img, cano.x, cano.y, cano.largura, cano.altura);

        if(!cano.passou && passaro.x > cano.x + cano.largura){
            cano.passou = true;
            pontos += 0.5;
            pontoSom.play();
        }
        if(DetectarColisao(passaro, cano)){
            hitSom.play();
            gameOver = true;
        }
    }

    while(canosArray.length > 0 && canosArray[0].x < -canoLargura){
        canosArray.shift();
    }

    context.fillStyle = "white";
    context.font = "4rem pixelify sans";
    context.fillText(pontos, bordaLargura / 2, 80);

    if(gameOver){
        context.fillStyle = "white";
        context.fillStyle = "text-type: bold";
        context.font = "2.6rem pixelify sans";
        context.fillText("Fim de Jogo", bordaLargura/5, bordaAltura/2);
        context.font = "1.2rem pixelify sans";
        context.fillText("Aperte espaço para recomeçar", bordaLargura/10, bordaAltura/2 + 30);
        bgm.pause();
        bgm.currentTime = 0;
    }

    switch(pontos){
        case 0:
            dificuldade = 1;
            break;
        case 5:
            dificuldade = 1.25;
            break;
        case 10:
            dificuldade = 1.5;
            break;
        case 10:
            dificuldade = 1.75;
            break;
        case 15:
            dificuldade = 2;
            break;
        case 20:
            dificuldade = 2.5;
            break;
    }
}

function AdicionarCanos(){
    if(gameOver){
        return;
    }
    let canoRandY = canoY - canoAltura / 4 - Math.random() * (canoAltura / 2);
    let abertura = canoAltura / (2 * dificuldade);

    let canoCima = {
        img: canoCimaImg,
        x: canoX,
        y: canoRandY,
        largura: canoLargura,
        altura: canoAltura,
        passou: false
    }

    canosArray.push(canoCima);

    let canoBaixo = {
        img: canoBaixoImg,
        x: canoX,
        y: canoRandY + canoAltura + abertura,
        largura: canoLargura,
        altura: canoAltura,
        passou: false
    }

    canosArray.push(canoBaixo);
}

function MoverPassaro(e){
    if(e.code == "ArrowUp" || e.code == "Space" || e.code == "KeyX"){
        if(bgm.paused){
            bgm.play();
        }
        asaSom.play();
        velocidadeY = -6;
    }

    if(gameOver){
        passaro.y = borda.height / 2 - passaro.altura / 2;
        pontos = 0;
        canosArray = [];
        gameOver = false;
    }
}

function DetectarColisao(a,b){
    return a.x < b.x + b.largura &&
    a.x + a.largura > b.x &&
    a.y < b.y + b.altura &&
    a.y + a.altura > b.y
}

function AnimarPassaro(){
    birdImgsIndex++;
    birdImgsIndex %= birdImgs.length;
}
