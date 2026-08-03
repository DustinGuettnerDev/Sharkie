/**
 * Class representing a Poison Bottle in the game.
 */
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

    /**
     * Creates a poison bottle at the specified position.
     * @param {number} x X-coordinate.
     * @param {number} y Y-coordinate.
     * @param {boolean} left Whether to use the left-facing image variant.
     */
    constructor(x = 0, y = 0, left = false) {
        super();
        this.x = x;
        this.y = y;
        this.setPoisonBottleCollectible(left);
    }

    /**
     * Loads the appropriate poison bottle image depending on its facing direction.
     * @param {boolean} left True for the left-facing image, false for the right-facing image.
     */
    setPoisonBottleCollectible(left) {
        if (left) {
            this.loadImage(IMG_PATHS.poisonBottle.left);
        } else {
            this.loadImage(IMG_PATHS.poisonBottle.right);
        }
    }

    /**
     * Deactivates the poison bottle for a set amount of time, making it invisible and then visible again after the specified duration.
     */
    deactivateForTime() {
        this.isVisible = false;
        setTimeout(() => {
            this.isVisible = true;
        }, this.timeTillPBSpawnsAgain);
    }
}
