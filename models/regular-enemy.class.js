/**
 * Represents a regular enemy in the game, extending the Enemy class.
 */
class RegularEnemy extends Enemy {
    movementInterval = null;

    constructor(positionOffset = 900, speedOffset = 0.4) {
        super();
        this.positionOffset = positionOffset;
        this.speedOffset = speedOffset;
        this.x = 380 * Math.random() + this.positionOffset;
        this.y = 400 * Math.random();
        this.speed = this.speedOffset + Math.random() * 0.5;
    }

    /**
     * Starts the movement of the regular enemy, moving it left until it is dead, at which point it stops moving.
     */
    movement() {
        this.movementInterval = setInterval(() => {
            if (this.death) {
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
     * Handles the movement of the regular enemy when it is dead, stopping its movement interval.
     */
    handleDeathMovement() {
        this.stopMovementInterval();
    }
}
