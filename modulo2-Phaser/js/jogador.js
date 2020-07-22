export default class Jogador {
    constructor(cena) {
        this.cena = cena;
        this.sprite = cena.physics.add.sprite(10, 140, 'slime');
        this.sprite.body.setSize(24, 16);
        this.sprite.setBounce(0.2)
        this.sprite.setCollideWorldBounds(true);

        // cria as animações
        cena.anims.create({
            key: 'direita',
            frames: cena.anims.generateFrameNumbers('slime', { start: 3, end: 5 }),
            frameRate: 10,
            repeat: -1
        });

        cena.anims.create({
            key: 'atoa',
            frames: cena.anims.generateFrameNumbers('slime', { start: 6, end: 8 }),
            frameRate: 10,
            repeat: -1
        });

        cena.anims.create({
            key: 'pulando',
            frames: cena.anims.generateFrameNumbers('slime', { start: 0, end: 2 }),
            frameRate: 20,
            repeat: -1
        });

        cena.anims.create({
            key: 'esquerda',
            frames: cena.anims.generateFrameNumbers('slime', { start: 3, end: 5 }),
            frameRate: 10,
            repeat: -1
        });
    
    }
}