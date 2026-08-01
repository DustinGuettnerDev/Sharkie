/**
 * Represents a jellyfish enemy in the game, extending the RegularEnemy class.
 */
class JellyFish extends RegularEnemy {
    height = 120;
    width = 120;
    animateInterval = null;
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
        this.loadImage(IMG_PATHS.jellyFish.swim[0]);
        this.loadImages(IMG_PATHS.jellyFish.swim);
        this.loadImages(IMG_PATHS.jellyFish.dead);
        this.animate();
        this.movement();
    }

    /**
     * Animates the jellyfish by cycling through its swimming or death images based on its current state.
     */
    animate() {
        this.animateInterval = setInterval(() => {
            if (this.world.isPaused) return;
            if (this.dead) {
                const deathAnimationEnd = this.playAnimation(IMG_PATHS.jellyFish.dead);
            } else {
                this.playAnimation(IMG_PATHS.jellyFish.swim);
            }
        }, this.animationTicksMs);
    }
}
