import CenaCarregamento from './cena-carregamento.js';
import CenaJogo from './cena-jogo.js';
import CenaGameOver from './cena-gameover.js';

const config = {
    type: Phaser.AUTO,
    width: 400,
    height: 240,
    parent: 'jogo-slime-floresta',
    physics: {
        default: 'arcade',
        arcade: {
            gravity: {
                y: 100
            }
        }
    },
    scene: [
        CenaCarregamento,
        CenaJogo,
        CenaGameOver
    ]
};

const jogo = new Phaser.Game(config);