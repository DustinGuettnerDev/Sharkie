class JellyFish extends RegularEnemy {
    height = 120;
    width = 120;
    imagesSwimming = [
        "img/2.Enemy/2 Jelly fish/Súper dangerous/Pink 1.png",
        "img/2.Enemy/2 Jelly fish/Súper dangerous/Pink 2.png",
        "img/2.Enemy/2 Jelly fish/Súper dangerous/Pink 3.png",
        "img/2.Enemy/2 Jelly fish/Súper dangerous/Pink 4.png",
    ];
    imagesDeath = [
        "img/2.Enemy/2 Jelly fish/Dead/Pink/P1.png",
        "img/2.Enemy/2 Jelly fish/Dead/Pink/P2.png",
        "img/2.Enemy/2 Jelly fish/Dead/Pink/P3.png",
        "img/2.Enemy/2 Jelly fish/Dead/Pink/P4.png",
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
        this.loadImages(this.imagesDeath);
        this.animate();
        this.movement();
    }

    animate() {
        setInterval(() => {
            if (this.death) {
                this.playAnimation(this.imagesDeath);
                this.stopMovement();
            } else {
                this.playAnimation(this.imagesSwimming);
            }
        }, this.animationTicksMs);
    }
}
