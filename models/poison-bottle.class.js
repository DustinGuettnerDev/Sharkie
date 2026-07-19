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

    constructor(x = 0, y = 0, left = false) {
        super();
        this.x = x;
        this.y = y;
        this.setPoisonBottleCollectible(left);
    }

    /**
     * Checks if the poison bottle should be display to the left or to the right
     * @param {boolean} left True if the poison bottle should be displayed to the left, false for right.
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
