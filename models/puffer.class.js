class Puffer extends RegularEnemy {
    height = 100;
    width = 100;
    imagesSwimming = [
        "img/2.Enemy/1.Puffer fish (3 color options)/1.Swim/1.swim1.png",
        "img/2.Enemy/1.Puffer fish (3 color options)/1.Swim/1.swim2.png",
        "img/2.Enemy/1.Puffer fish (3 color options)/1.Swim/1.swim2.png",
        "img/2.Enemy/1.Puffer fish (3 color options)/1.Swim/1.swim3.png",
        "img/2.Enemy/1.Puffer fish (3 color options)/1.Swim/1.swim4.png",
    ];

    imageDeath =
        "img/2.Enemy/1.Puffer fish (3 color options)/4.DIE/1.Dead 1 (can animate by going up).png";

    offset = {
        top: 10,
        bottom: 30,
        left: 5,
        right: 10,
    };
    life = 1;
    damageType = "poison";
    world;
    rangeAfterSlap = 300;
    deathKnockbackStarted = false;

    // man muss hier die eigenschaften nicht nochmal deklarieren, da sie schon im parent deklariert wurden
    constructor(positionOffset = 0, speedOffset = 0) {
        super(positionOffset, speedOffset);
        this.loadImage(this.imagesSwimming[0]);
        this.loadImages(this.imagesSwimming);
        this.animate();
        this.movement();
    }

    animate() {
        setInterval(() => {
            if (this.death) {
                this.loadImage(this.imageDeath);
            } else {
                this.playAnimation(this.imagesSwimming);
            }
        }, this.animationTicksMs);
    }

    handleDeathMovement() {
        if (this.deathKnockbackStarted) {
            return;
        }

        this.stopMovement();

        const hitFromLeft = this.world.character.x < this.x;

        if (hitFromLeft) {
            this.pushLeftTop({
                xStepPx: 10,
                yStepPx: 10,
                leftLimit: this.x - this.rangeAfterSlap,
                riseLimit: this.y - this.rangeAfterSlap,
            });
        } else {
            this.pushRightTop({
                xStepPx: 10,
                yStepPx: 10,
                rightLimit: this.x + this.rangeAfterSlap,
                riseLimit: this.y - this.rangeAfterSlap,
            });
        }

        this.deathKnockbackStarted = true;
    }
}
