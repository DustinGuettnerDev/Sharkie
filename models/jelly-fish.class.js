class JellyFish extends RegularEnemies {
    height = 120;
    width = 120;
    imagesSwimming = [
        "img/2.Enemy/2 Jelly fish/Súper dangerous/Pink 1.png",
        "img/2.Enemy/2 Jelly fish/Súper dangerous/Pink 2.png",
        "img/2.Enemy/2 Jelly fish/Súper dangerous/Pink 3.png",
        "img/2.Enemy/2 Jelly fish/Súper dangerous/Pink 4.png",
    ];
    offset = {
        top: 10,
        bottom: 15,
        left: 5,
        right: 10,
    };
    life = 1;
    damageType = "shock";

    // man muss hier die eigenschaften nicht nochmal deklarieren, da sie schon im parent deklariert wurden
    constructor(positionOffset = 0, speedOffset = 0.4) {
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
