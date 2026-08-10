/**
 * Represents a regular enemy in the game, extending the Enemy class.
 */
class RegularEnemy extends Enemy {
    movementInterval = null;

    /**
     * Creates a regular enemy with randomized position and speed.
     * @param {number} positionOffset Base x-position offset for spawning.
     * @param {number} speedOffset Base speed factor.
     */
    constructor(positionOffset = 900) {
        super();
        this.positionOffset = positionOffset;
        this.x = 200 * Math.random() + this.positionOffset;
        this.y = 400 * Math.random();
        this.speed = Math.random() + 0.5;
    }

    /**
     * Starts the movement of the regular enemy, moving it left until it is dead, at which point death movement takes over.
     */
    movement() {
        this.movementInterval = setInterval(() => {
            if (!this.world || this.world.isPaused) return;
            if (this.dead) {
                this.handleDeathMovement();
            } else {
                this.handleAliveMovement();
            }
        }, this.movementTickMs);
    }

    /**
     * Handles the movement of the regular enemy when it is alive, moving it to the left.
     */
    handleAliveMovement() {
        this.moveLeft();
    }

    /**
     * Handles death movement for the regular enemy by stopping its movement interval.
     */
    handleDeathMovement() {
        this.stopMovementInterval();
    }
}
