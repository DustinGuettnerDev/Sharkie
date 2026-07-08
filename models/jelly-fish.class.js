/**
 * Represents a jelleyfish enemy in the game, extending the RegularEnemy class.
 */
class JellyFish extends RegularEnemy {
    height = 120;
    width = 120;
    animateInterval = null;
    imagesSwimming = IMG_PATHS.jellyFish.swimming;
    imagesDeath = IMG_PATHS.jellyFish.death;
    collisionOffset = {
        top: 10,
        bottom: 15,
        left: 5,
        right: 10,
    };
    lifeCount = 1;
    damageType = "shock";
    weakness = ["bubble", "poison-bubble"];

    constructor(positionOffset = 0, speedOffset = 0.4) {
        super(positionOffset, speedOffset);
        this.loadImage(this.imagesSwimming[0]);
        this.loadImages(this.imagesSwimming);
        this.loadImages(this.imagesDeath);
        this.animate();
        this.movement();
    }

    /**
     * Animates the jellyfish by cycling through its swimming or death images based on its current state.
     */
    animate() {
        this.animateInterval = setInterval(() => {
            if (this.death) {
                const deathAnimationEnd = this.playAnimation(this.imagesDeath);
                if (deathAnimationEnd) {
                    this.stopAnimationInterval();
                }
            } else {
                this.playAnimation(this.imagesSwimming);
            }
        }, this.animationTicksMs);
    }
}
