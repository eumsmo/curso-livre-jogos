import Jogador from "./jogador.js";

export default class CenaJogo extends Phaser.Scene {
    constructor() {
        super({
            key: 'CenaJogo'
        });
    }

    preload() {

    }

    create() {
        // const larguraJogo = this.sys.canvas.width;
        // const alturaJogo = this.sys.canvas.height;
        // this.add.image(larguraJogo/2, alturaJogo/2, 'forest');
        const imagemFundo = this.add.image(0, 0, 'forest');
        imagemFundo.setOrigin(0, 0);

        const plataformas = this.physics.add.staticGroup();
        plataformas.create(0, 184, 'chao').setOrigin(0, 0).refreshBody();
        plataformas.create(400 - 30, 240 - 56 - 34 - 34, 'platform').setOrigin(0, 0).refreshBody();
        plataformas.create(400 - 60, 240 - 56 - 34, 'platform').setOrigin(0, 0).refreshBody();
        plataformas.create(40, 60, 'platform').setOrigin(0, 0).refreshBody();
        plataformas.create(195, 80, 'platform').setOrigin(0, 0).refreshBody();

        this.jogador = new Jogador(this);
        this.physics.add.collider(this.jogador.sprite, plataformas);

        this.teclas = this.input.keyboard.createCursorKeys();

        this.moedas = this.physics.add.group({
            key: 'moeda',
            repeat: 12,
            setXY: { x: 44, y: -16, stepX: 26},
            setScale: { x: 0.6, y: 0.6}
        });

        this.moedas.children.iterate(function (child) {

            child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));

        });

        this.physics.add.collider(this.moedas, plataformas);
        this.physics.add.overlap(this.jogador.sprite, this.moedas, this.moedaColetada, null, this);

        this.count_moedas = 0;
        this.moedasTexto = this.add.text(8, 220, 'Moedas: 0', { fontSize: '16px', fill: '#fff' });


        this.bombas = this.physics.add.group();
        this.physics.add.collider(this.bombas, plataformas);
        this.physics.add.collider(this.jogador.sprite, this.bombas, this.bateNaBomba, null, this);
    }

    update() {
        // cria um atalho pra evitar ficar digitando "this.jogador.sprite"
        const jogador = this.jogador.sprite;

        // setas da esquerda, direita (ou sem movimento)
        if (this.teclas.left.isDown) {
            jogador.setVelocityX(-160);
            jogador.setFlip(true, false)
            jogador.anims.play('esquerda', true);
        }
        else if (this.teclas.right.isDown) {
            jogador.setVelocityX(160);
            jogador.setFlip(false, false)
            jogador.anims.play('direita', true);
        } else {
            // nem esquerda, nem direita - parado ou pulando
            jogador.setVelocityX(0);
            if (jogador.body.touching.down) {
                jogador.anims.play('atoa');
            }
        }

        // seta para cima fazendo pular, mas só se estiver no chão
        if (this.teclas.up.isDown && jogador.body.touching.down) {
            jogador.setVelocityY(-100);
            jogador.anims.play('pulando');
        } else if (this.teclas.down.isDown) {
            jogador.setVelocityY(150);
        }

    }

    moedaColetada(jogador,moeda){
        moeda.disableBody(true, true);
        
        this.count_moedas++;
        this.moedasTexto.setText('Moedas: ' + this.count_moedas);

        if (this.moedas.countActive(true) === 0) {
            this.moedas.children.iterate(function (child) {
                child.enableBody(true, child.x, 0, true, true);
            });

            var x = (jogador.x < 400) ? Phaser.Math.Between(400, 800) : Phaser.Math.Between(0, 400);

            var bomba = this.bombas.create(x, 16, 'bomba');
            bomba.setBounce(1);
            bomba.setCollideWorldBounds(true);
            bomba.setVelocity(Phaser.Math.Between(-200, 200), 20);
            bomba.setDisplaySize(16, 16);

        }
    }

    bateNaBomba(jogador,bomba){
        this.physics.pause();
        jogador.setTint(0xff0000);
        setTimeout(()=>{
            this.scene.start('CenaGameOver', {moedas: this.count_moedas});
        },200);
    }
}