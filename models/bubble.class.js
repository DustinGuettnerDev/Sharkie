/**
 * Represents a bubble in the game, extending the MovableObject class.
 */
class Bubble extends MovableObject {
    height = 60;
    width = 60;
    x;
    y;
    forward;
    speed = 2;
    movementInterval = null;
    world;
    isPoisonBubble;

    imageBubble = IMG_PATHS.bubble.normal;
    imagePoisonBubble = IMG_PATHS.bubble.poison;

    constructor(x = 0, y = 0, forward = true, world = null, isPoisonBubble = false) {
        super();
        this.x = x;
        this.y = y;
        this.forward = forward;
        this.world = world;
        this.isPoisonBubble = isPoisonBubble;
        this.setBubbleImage(isPoisonBubble);
        this.movement();
    }

    /**
     * Sets the image of the bubble based on whether it is a poison bubble or not.
     */
    setBubbleImage() {
        if (this.isPoisonBubble) {
            this.loadImage(this.imagePoisonBubble);
        } else {
            this.loadImage(this.imageBubble);
        }
    }

    /**
     * Moves the bubble in the current direction at the set speed.
     */
    movement() {
        if (!this.world?.character) return;
        let bubbleStartPosition = this.world.character.x;
        this.movementInterval = setInterval(() => {
            if (this.forward) {
                this.moveRight();
            } else {
                this.moveLeft();
            }

            if (this.rangeReached(400, bubbleStartPosition)) {
                this.removeFromWorld();
            }
        }, this.movementTickMs);
    }

    /**
     * Removes the bubble from the world and stops its movement interval.
     */
    removeFromWorld() {
        if (this.world) {
            this.world.bubbles = this.world.bubbles.filter((bubble) => bubble !== this);
        }
        this.stopMovementInterval();
    }

    /**
     * Check if the bubble has reached its max range from its starting position.
     * @param {number} range The maximum distance the bubble can travel.
     * @param {number} bubbleStart The starting x-coordinate of the bubble.
     * @returns {boolean} True if the bubble has reached the specified range, false otherwise.
     */
    rangeReached(range, bubbleStart) {
        return Math.abs(bubbleStart - this.x) >= range;
    }
}
