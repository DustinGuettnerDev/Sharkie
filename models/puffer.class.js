class Puffer extends RegularEnemies {
    height = 100;
    width = 100;
    imagesSwimming = [
        "img/2.Enemy/1.Puffer fish (3 color options)/1.Swim/1.swim1.png",
        "img/2.Enemy/1.Puffer fish (3 color options)/1.Swim/1.swim2.png",
        "img/2.Enemy/1.Puffer fish (3 color options)/1.Swim/1.swim2.png",
        "img/2.Enemy/1.Puffer fish (3 color options)/1.Swim/1.swim3.png",
        "img/2.Enemy/1.Puffer fish (3 color options)/1.Swim/1.swim4.png",
    ];
    imagesNumberSwimming;
    offset = {
        top: 10,
        bottom: 30,
        left: 5,
        right: 10,
    };
    life = 1;

    // man muss hier die eigenschaften nicht nochmal deklarieren, da sie schon im parent deklariert wurden
    constructor(positionOffset = 0, speedOffset = 0) {
        super(positionOffset, speedOffset);
        this.loadImage(this.imagesSwimming[0]);
        this.loadImages(this.imagesSwimming);
        this.animate();
    }

    animate() {
        this.playAnimationAuto();
        this.moveLeftAuto();
    }
}
