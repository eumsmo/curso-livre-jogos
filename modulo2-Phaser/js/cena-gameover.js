export default class CenaGameOver extends Phaser.Scene {
    constructor() {
        super({
            key: 'CenaGameOver'
        });
    }

    init(data){
        this.moedas = data.moedas || 0;
    }

    preload() {

    }

    numeroBonito(numero){
        return (numero).toLocaleString('en-US', { minimumIntegerDigits: 5, useGrouping: false });
    }

    create() {
        this.aux_moedas = 0;
        this.contador = 0;

        this.creditos = this.add.text(8, 218, 'Feito por: Juan Vitor (jv_eumsmo)', { fontSize: '12px', fill: '#fff' }).setOrigin(0, 0.5);
        this.gameover = this.add.text(200, 80, 'GAME OVER', { align: "center", fontSize: '48px', fill: '#f00', stroke: "#f00", strokeThickness: 2 }).setOrigin(0.5, 0.5);
        
        this.textoPontuacao = this.add.text(80, 120, 'Pontuação:', { align: "center", fontSize: '24px', fill: '#fff' }).setOrigin(0, 0.5);
        this.pontuacao = this.add.text(240, 120, "00000", { fontSize: '24px', fill: '#fff' }).setOrigin(0, 0.5);

        
        this.add.rectangle(354, 218, 80, 30, 0x00bb00).setOrigin(0.5, 0.5);
        this.resetBtn = this.add.text(354, 218, 'RESET', { align: "center", fontSize: '18px', fill: '#fff', stroke: "#fff", strokeThickness: 1 }).setOrigin(0.5, 0.5);
        this.resetBtn.setInteractive({ cursor: 'pointer' });
        this.resetBtn.on('pointerup', function () {
            this.scene.start('CenaJogo');
        }, this);
    }

    update(tempo) {

        if (this.aux_moedas < this.moedas){
            this.contador++;

            if(this.contador>=8){
                this.aux_moedas++;
                this.pontuacao.setText(this.numeroBonito(this.aux_moedas));
                this.contador=0;
            }
        }
    }
}