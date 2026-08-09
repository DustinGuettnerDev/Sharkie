/**
 * Represents a puffer fish enemy that becomes aggressive when the character enters its range.
 */
class Puffer extends RegularEnemy {
    height = 100;
    width = 100;
    animateInterval = null;
    collisionOffset = {
        top: 10,
        bottom: 10,
        left: 5,
        right: 10,
    };

    aggroOffset = {
        top: -100,
        bottom: -100,
        left: -100,
        right: -100,
    };
    lifeCount = 1;
    damageType = "poison";
    world = null;
    rangeAfterSlap = 300;
    deathKnockbackDirection = null;
    deathKnockbackStarted = false;
    weakness = ["slap"];
    transitionAggroEnded = false;
    aggro = false;
    speedSlap = 10;

    /**
     * Initializes the puffer with its animations and starts its loops.
     * @param {number} positionOffset Initial x-position offset.
     * @param {number} speedOffset Speed variation factor.
     */
    constructor(positionOffset = 0) {
        super(positionOffset);
        this.loadImage(IMG_PATHS.puffer.swim[0]);
        this.loadImages(IMG_PATHS.puffer.swim);
        this.loadImages(IMG_PATHS.puffer.transition);
        this.loadImages(IMG_PATHS.puffer.bubbleSwim);
        this.animate();
        this.movement();
    }

    /**
     * Animates the puffer by cycling through its swimming, aggro transition, or aggro images based on its current state.
     */
    animate() {
        this.animateInterval = setInterval(() => {
            if (this.world.isPaused) return;
            if (this.checkDeath()) return;
            this.checkAggroRange();
            if (this.checkAggro()) return;
            this.checkSwimming();
        }, this.animationTicksMs);
    }

    /**
     * Checks if the puffer is dead and handles its death animation and movement.
     * @returns {boolean} True if the puffer is dead, false otherwise.
     */
    checkDeath() {
        if (this.dead) {
            this.loadImage(IMG_PATHS.puffer.dead);
            this.stopAnimationInterval();
            return true;
        }
        return false;
    }

    /**
     * Checks if the Character is within the aggro range of the puffer and sets the aggro state accordingly.
     * @returns {boolean} True if the character is within the aggro range, false otherwise.
     */
    checkAggroRange() {
        if (this.isInAggroRange(this.world.character)) {
            this.aggro = true;
            return true;
        }
        return false;
    }

    /**
     * Checks if the puffer is in aggro state and handles its aggro animations.
     * @returns {boolean} True if the puffer is in aggro state, false otherwise.
     */
    checkAggro() {
        if (!this.aggro) return false;

        if (this.transitionAggroEnded) {
            this.playAnimation(IMG_PATHS.puffer.bubbleSwim);
            return true;
        }
        this.transitionAggroEnded = this.playAnimation(IMG_PATHS.puffer.transition);
        return true;
    }

    /**
     * Checks if the puffer is in swimming state and handles its swimming animations.
     * @returns {boolean} True if the puffer is in swimming state, false otherwise.
     */
    checkSwimming() {
        this.playAnimation(IMG_PATHS.puffer.swim);
        this.transitionAggroEnded = false;
        return true;
    }

    /**
     * Handles the puffer's death movement by applying knockback and upward movement.
     */
    handleDeathMovement() {
        if (!this.world?.character) return;
        this.initDeathKnockbackDirection();
        this.applyDeathKnockback();
    }

    /**
     * Sets the knockback direction once based on the character's position relative to this puffer.
     */
    initDeathKnockbackDirection() {
        if (!this.deathKnockbackStarted) {
            this.deathKnockbackDirection = this.world.character.x < this.x ? "left" : "right";
            this.deathKnockbackStarted = true;
        }
    }

    /**
     * Moves the puffer diagonally upward in the knockback direction during its death sequence.
     */
    applyDeathKnockback() {
        if (this.y > -500) {
            if (this.deathKnockbackDirection === "left") {
                this.moveLeft(this.speedSlap);
                this.moveUp(this.speedSlap);
            } else {
                this.moveRight(this.speedSlap);
                this.moveUp(this.speedSlap);
            }
        }
    }

    /**
     * Checks if the character is within the aggro range of the puffer based on their positions and collision offsets.
     * @param {Character} character The character to check against.
     * @returns {boolean} True if the character is within the aggro range, false otherwise.
     */
    isInAggroRange(character) {
        return (
            this.x + this.width - this.aggroOffset.right >
                character.x + character.collisionOffset.left &&
            this.y + this.height - this.aggroOffset.bottom >
                character.y + character.collisionOffset.top &&
            this.x + this.aggroOffset.left <
                character.x + character.width - character.collisionOffset.right &&
            this.y + this.aggroOffset.top <
                character.y + character.height - character.collisionOffset.bottom
        );
    }
}
