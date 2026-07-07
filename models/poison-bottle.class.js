class PoisonBottle extends DrawableObject {
    height = 70;
    width = 70;
    x;
    y;

    isVisible = true;
    timeTillPBSpawnsAgain = 5000;

    collisionOffset = {
        top: 5,
        bottom: 5,
        left: 5,
        right: 5,
    };

    imagePoisonBottleLeft = "img/4. Marcadores/Posión/Dark - Left.png";
    imagePoisonBottleRight = "img/4. Marcadores/Posión/Dark - Right.png";

    constructor(x = 0, y = 0, left = false) {
        super();
        this.x = x;
        this.y = y;
        this.setPoisonBottleCollectible(left);
    }

    setPoisonBottleCollectible(left) {
        if (left) {
            this.loadImage(this.imagePoisonBottleLeft);
        } else {
            this.loadImage(this.imagePoisonBottleRight);
        }
    }

    deactivateForTime() {
        this.isVisible = false;
        setTimeout(() => {
            this.isVisible = true;
        }, this.timeTillPBSpawnsAgain);
    }
}
