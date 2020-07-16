const JOGO_ALTURA = 250;
const JOGO_LARGURA = 500;

const canvas = document.querySelector("canvas");
const contexto = canvas.getContext("2d");

canvas.width = JOGO_LARGURA;
canvas.height = JOGO_ALTURA;


const geraImagem = src=> {
    let img = new Image();
    img.src = src;
    return img;
};

const IMAGENS = {
    "nave": "img/nave.png",
    "meteoro1": "img/meteoro1.png",
    "tiro1": "img/tiro1.png"
};



class Sprite {
    constructor(imagem, x, y, largura, altura) {
        this.imagem = geraImagem(imagem);
        this.x = x;
        this.y = y;
        this.largura = largura;
        this.altura = altura;

        this.imagemPronta = false;
        this.imagem.addEventListener('load', () => this.imagemPronta = true);
    }

    desenhar(ctx) {
        contexto.strokeStyle = "red";
        
        if (this.imagemPronta) {
            ctx.drawImage(this.imagem, this.x, this.y, this.largura, this.altura);
        } else { 
            ctx.strokeRect(this.x, this.y, this.largura, this.altura);
        }
    }

    static is_quadrado(sprite){
        return sprite.largura == sprite.altura;
    }

    static ponto_central(sprite){
        return {
            relativo: {
                x: sprite.largura / 2,
                y: sprite.altura / 2
            },
            absoluto: {
                x: sprite.x + sprite.largura/2,
                y: sprite.y + sprite.altura/2
            }
        }
    }

    static distancia(sprite1, sprite2 = {x:0,y:0}){
        
        let x1 = sprite1.x, y1 = sprite1.y,
            x2 = sprite2.x, y2 = sprite2.y,
            x = Math.abs(x2-x1),
            y = Math.abs(y1-y2);

        return Math.sqrt(Math.pow(x,2) + Math.pow(y,2));
    }

    // Colisão circular ( a partir de um quadrado )
    static colisao_quadrado(sprite1, sprite2){
        let ponto1 = this.ponto_central(sprite1),
            ponto2 = this.ponto_central(sprite2),
            raio1 = this.distancia(ponto1.relativo),
            raio2 = this.distancia(ponto2.relativo);

        return this.distancia(ponto1.absoluto, ponto2.absoluto) <= raio1 + raio2;
    }

    static intersecao_seguimentos(seg1,seg2){
    }

    static colisao_retangular(sprite1, sprite2){
    }

    colide(other){
        if(Sprite.is_quadrado(this) && Sprite.is_quadrado(other)){
            if(!Sprite.colisao_quadrado(this,other)) return false;
        }

        return true;
    }
}

const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

class Meteoro extends Sprite{
    constructor(){
        let tamanho = 64;
        super(IMAGENS["meteoro1"], JOGO_LARGURA, randomInt(0, JOGO_ALTURA - tamanho), tamanho, tamanho);
        this.velocidadeX = -1 * Math.random() - 1;
    }

    atualizar(){
        this.x += this.velocidadeX;

        if (this.x < -this.largura)
            this.destruir();
    }

    destruir(){
        this.x = JOGO_LARGURA + 3;
        this.y = randomInt(0, JOGO_ALTURA - 32);
        this.velocidadeX = 0;

        let meteoro_cooldown = randomInt(400, 2200);
        setTimeout(() => this.velocidadeX = -2 * Math.random() - 1, meteoro_cooldown);
    }
}

class Tiro extends Sprite{
    constructor(x,y, velocidadeX=1, velocidadeY=0, forca=1){
        super(IMAGENS["tiro1"],x,y,10,10);
        this.velocidadeX = velocidadeX;
        this.velocidadeY = velocidadeY;
        this.forca = forca;

        this.podeSerDestruido = false;
    }

    atualizar(){
        this.x+=this.velocidadeX;
        this.y+=this.velocidadeY;

        if(this.x<-this.largura || this.x > JOGO_LARGURA || this.y<-this.altura || this.y>JOGO_ALTURA){
            this.podeSerDestruido = true;
        }
    }

    desenhar(ctx){
        contexto.fillStyle = "magenta";
        ctx.fillRect(this.x, this.y, this.largura, this.altura);
    }
}

class Jogador extends Sprite{
    constructor(x,y){
        let tamanho = 56;
        super(IMAGENS["nave"], x, y, tamanho, tamanho);
        this.tiro_cooldown = false;
        this.dano_cooldown = false;
        this.hp = 5;
        this.pontuacao = 0;
    }

    atualizar(){
        const velocidade = 2;
        
        if (teclas["w"] || teclas["W"] || teclas["ArrowUp"]) personagem.y -= velocidade;
        if (teclas["a"] || teclas["A"] || teclas["ArrowLeft"]) personagem.x -= velocidade;
        if (teclas["s"] || teclas["S"] || teclas["ArrowDown"]) personagem.y += velocidade;
        if (teclas["d"] || teclas["D"] || teclas["ArrowRight"]) personagem.x += velocidade;
        if ((teclas[" "] || teclas["Enter"]) && !this.tiro_cooldown) this.atirar();
    }

    desenhar(ctx){
        if (this.dano_cooldown) ctx.globalAlpha = 0.4;
        super.desenhar(ctx);
        ctx.globalAlpha = 1;
    }

    levar_dano(){
        this.hp--;
        this.dano_cooldown = true;

        setTimeout(()=> this.dano_cooldown = false, 3000);
    }

    atirar(){
        console.log("alo");
        let tiro = new Tiro(this.x + this.largura + 10, this.y, 3);
        tiros.push(tiro);
        this.tiro_cooldown = true;

        setTimeout(()=> this.tiro_cooldown = false, 100);
    }
}

let personagem = new Jogador(10,10);

let meteoros = [];
let tiros = [];

let tempo = 0;
let tempo_de_spawn = 100;

const fundo = geraImagem("img/espaco.jpg");

function atualizar(){
    contexto.clearRect(0,0,canvas.width,canvas.height);
    contexto.drawImage(fundo,0,0, JOGO_LARGURA, JOGO_ALTURA);
    
    personagem.atualizar();
    personagem.desenhar(contexto);

    // Atualiza meteoros
    for(let meteoro of meteoros){
        meteoro.atualizar();
        meteoro.desenhar(contexto);

        if (!personagem.dano_cooldown && meteoro.colide(personagem)){
            meteoro.destruir();
            personagem.levar_dano();
        }
    }

    // Atualiza tiros 
    for (let i = 0; i < tiros.length; i++) {
        let tiro = tiros[i];
        
        tiro.atualizar();
        tiro.desenhar(contexto);

        for (let meteoro of meteoros) {
            if(tiro.colide(meteoro)){
                tiro.podeSerDestruido = true;
                meteoro.destruir();
                personagem.pontuacao++;
            }
        }

        if (tiro.podeSerDestruido) tiros.splice(i, 1);
    }

    if (meteoros.length < 5 && tempo % tempo_de_spawn==0){
        let novo_meteoro = new Meteoro();
        meteoros.push(novo_meteoro);
    } 

    contexto.font = 'small-caps 25px Arial';
    contexto.fillStyle = "Red";
    contexto.fillText("Hp: " + personagem.hp, 5, 25);
    contexto.fillStyle = "Black";
    contexto.fillText("Score: " + personagem.pontuacao, 5, JOGO_ALTURA - 10);
    tempo++;

    if(personagem.hp < 1){
        alert("Você perdeu :(");
        alert("Mas esse jogo nunca vai ter um final, então...");
        personagem.hp = 5;
        personagem.score = 0;
    }
}

const teclas = {
/*
    pressionadas(...teclas){
        for(let tecla of teclas){
            if(!this[tecla])
                return false;
        }
        return true;
    }
*/
};


window.addEventListener("keydown", evt => teclas[evt.key] = true);
window.addEventListener("keyup", evt => teclas[evt.key] = false);

setInterval(atualizar, 10);