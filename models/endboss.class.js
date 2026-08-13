/**
 * Class representing the end boss enemy in the game.
 */
class Endboss extends Enemy {
    height = 600;
    width = 600;
    animateInterval = null;
    movementInterval = null;
    x = 8000;
    y = -100;
    speed = 5;
    collisionOffset = {
        top: 285,
        bottom: 100,
        left: 40,
        right: 45,
    };
    lifeCount = 5;
    damageType = "shock";
    weakness = ["poison-bubble"];
    deathAnimationEnd = false;
    attackAnimationEnd = false;
    hurtTime = 1;
    world = null;
    appearingPositionTrigger = 7200;
    appearAnimationStarted = false;
    appearAnimationEnd = false;
    startTime = Date.now();
    timeTillAttack = 1;
    attackMove = false;
    offsetYPositionToCharacter = 160;
    offsetRightPositionToCharacter = -80;
    offsetLeftPostionToCharacter = 400;
    deathRiseUpEnded = false;
    resetAttackTimer = false;
    roarSoundAlreayPlayed = false;
    roarCharacterPosition = 5000;

    /**
     * Initializes the endboss, loads all animation frames, and starts movement and animation loops.
     * @param {Object} [config={}] Optional initial positioning values.
     * @param {number} [config.x=8000] Initial x-position of the end boss.
     * @param {number} [config.appearingPositionTrigger=7200] Trigger position where the boss appears.
     */
    constructor({ x = 8000, appearingPositionTrigger = 7200 } = {}) {
        super();
        this.x = x;
        this.appearingPositionTrigger = appearingPositionTrigger;
        this.loadImages(IMG_PATHS.endboss.orca.swim);
        this.loadImages(IMG_PATHS.endboss.orca.attack);
        this.loadImages(IMG_PATHS.endboss.orca.hurt);
        this.loadImages(IMG_PATHS.endboss.orca.dead);
        this.loadImages(IMG_PATHS.endboss.orca.apear);
        this.animate();
        this.movement();
    }

    /**
     * Handles the movement of the endboss.
     * Checks for death sequence, attack, and character position to determine movement direction.
     */
    movement() {
        this.movementInterval = setInterval(() => {
            if (this.world.isPaused) return;
            if (this.checkDeathMovement()) return;
            if (this.checkDeathEndMovement()) return;
            if (this.checkHurtMovementStop()) return;
            if (this.checkAttackMovement()) return;
        }, this.movementTickMs);
    }

    /**
     * Moves the boss upward during the death sequence and marks the rise-up as finished.
     * @returns {boolean} True while death movement is applied, otherwise false.
     */
    checkDeathMovement() {
        if (this.dead && !this.deathRiseUpEnded) {
            this.moveUp(1);
            if (this.y <= -500) {
                this.deathRiseUpEnded = true;
            }
            return true;
        }
        return false;
    }

    /**
     * Stops attack movement processing once the boss is dead.
     * @returns {boolean} True when death state interrupts movement logic, otherwise false.
     */
    checkDeathEndMovement() {
        if (this.dead) {
            this.attackMove = false;
            this.stopMovementInterval();
            return true;
        }
        return false;
    }

    /**
     * Stops attack movement while the boss is in hurt state.
     * @returns {boolean} True if hurt-state movement blocking is active, otherwise false.
     */
    checkHurtMovementStop() {
        if (this.isHurt) {
            this.attackMove = false;
            return true;
        }
        return false;
    }

    /**
     * Moves the boss toward the character while attack movement is active.
     * @returns {boolean} True while attack movement is active, otherwise false.
     */
    checkAttackMovement() {
        if (!this.attackMove) return false;
        this.moveVerticallyTowardCharacter();
        this.moveHorizontallyTowardCharacter();
        return true;
    }

    /**
     * Moves the endboss vertically toward the character.
     */
    moveVerticallyTowardCharacter() {
        if (this.isAboveCharacter) {
            this.moveDown();
        } else if (this.isBelowCharacter) {
            this.moveUp();
        }
    }

    /**
     * Moves the endboss horizontally toward the character and updates its direction.
     */
    moveHorizontallyTowardCharacter() {
        if (this.isRightFromCharacter) {
            this.otherDirection = false;
            this.moveLeft();
        } else if (this.isLeftFromCharacter) {
            this.otherDirection = true;
            this.moveRight();
        }
    }

    /**
     * Controls animation state priority for appear, death, hurt, and attack.
     */
    animate() {
        this.animateInterval = setInterval(() => {
            if (this.world.isPaused) return;
            this.checkPositionCharacter();
            if (this.checkAppearing()) return;
            if (this.checkDeath()) return;
            if (this.checkHurt()) return;
            if (this.checkAttackTimer()) return;
            this.defaultImageEndboss();
        }, this.animationTicksMs);
    }

    /**
     * Plays the end boss intro roar once when the character reaches the trigger position.
     */
    checkPositionCharacter() {
        if (!this.roarSoundAlreayPlayed && this.world.character.x >= this.roarCharacterPosition) {
            this.roarSoundAlreayPlayed = true;
            AUDIO_PATHS.enemies.endboss.appear.play();
        }
    }

    /**
     * Plays the intro animation until it is completed once.
     * @returns {boolean} True while intro handling blocks other animations, otherwise false.
     */
    checkAppearing() {
        if (!this.appearAnimationEnd) {
            if (this.isAppearing || this.appearAnimationStarted) {
                this.appearAnimationEnd = this.playAnimation(IMG_PATHS.endboss.orca.apear);
                this.appearAnimationStarted = !this.appearAnimationEnd;
                if (this.appearAnimationEnd) {
                    this.startTime = Date.now();
                }
            }
            return true;
        }
        return false;
    }

    /**
     * Plays death handling when the boss has no life left.
     * @returns {boolean} True when death animation is active, otherwise false.
     */
    checkDeath() {
        if (this.dead) {
            AUDIO_PATHS.enemies.endboss.hurt.play();
            this.playDeathAnimation(IMG_PATHS.endboss.orca.dead);
            return true;
        }
        return false;
    }

    /**
     * Plays the hurt animation while the boss is in hurt state.
     * @returns {boolean} True when hurt animation is active, otherwise false.
     */
    checkHurt() {
        if (this.isHurt) {
            AUDIO_PATHS.enemies.endboss.attack.stop();
            AUDIO_PATHS.enemies.endboss.hurt.play();
            let animationEnd = this.playAnimation(IMG_PATHS.endboss.orca.hurt);
            if (animationEnd) {
                this.resetAttackTimer = true;
            }
            return true;
        }
        return false;
    }

    /**
     * Starts attack animation and toggles attack movement until animation ends.
     * @returns {boolean} True when attack handling is active, otherwise false.
     */
    checkAttackTimer() {
        if (this.attackTimer()) {
            this.attackAnimationEnd = this.playAnimation(IMG_PATHS.endboss.orca.attack);
            AUDIO_PATHS.enemies.endboss.attack.play();
            this.attackMove = true;
            if (this.attackAnimationEnd) {
                this.startTime = Date.now();
                this.attackMove = false;
            }
            return true;
        }
        return false;
    }

    /**
     * Plays the default swimming loop when no other state has priority.
     */
    defaultImageEndboss() {
        this.playAnimation(IMG_PATHS.endboss.orca.swim);
    }

    /**
     * Runs death animation once and stops animation loop afterward.
     */
    playDeathAnimation() {
        if (this.deathAnimationEnd) return;
        this.deathAnimationEnd = this.playAnimation(IMG_PATHS.endboss.orca.dead);
        if (this.deathAnimationEnd) {
            this.stopAnimationInterval();
        }
    }

    /**
     * Applies incoming damage and refreshes the last-hit timestamp.
     */
    getHit() {
        super.getHit();
        this.lastHit = Date.now();
    }

    /**
     * Returns true once the character reaches the intro trigger position.
     * @returns {boolean} True when the intro trigger position is reached, otherwise false.
     */
    get isAppearing() {
        if (!this.world?.character) return false;
        return this.world.character.x >= this.appearingPositionTrigger;
    }

    /**
     * Returns true when enough time passed to start the next attack.
     * Attack timing is paused while the character has zero life.
     * @returns {boolean} True when attack cooldown has elapsed, otherwise false.
     */
    attackTimer() {
        if (!this.world.character.hasZeroLife) {
            if (this.resetAttackTimer) {
                this.startTime = Date.now();
                this.resetAttackTimer = false;
            }
            let timepassed = (Date.now() - this.startTime) / 1000;
            return timepassed > this.timeTillAttack;
        }
        return false;
    }

    /**
     * Checks if the character is above the boss on the Y axis (smaller Y value).
     * @returns {boolean} True when the character is above the boss, otherwise false.
     */
    get isBelowCharacter() {
        if (!this.world?.character) return false;
        return this.world.character.y < this.y + this.offsetYPositionToCharacter;
    }

    /**
     * Checks if the character is below the boss on the Y axis (greater Y value).
     * @returns {boolean} True when the character is below the boss, otherwise false.
     */
    get isAboveCharacter() {
        if (!this.world?.character) return false;
        return this.world.character.y > this.y + this.offsetYPositionToCharacter;
    }

    /**
     * Checks whether the boss is right of the character's horizontal attack corridor.
     * @returns {boolean} True when the character is left of the boss corridor, otherwise false.
     */
    get isRightFromCharacter() {
        if (!this.world?.character) return false;
        return this.world.character.x < this.x + this.offsetRightPositionToCharacter;
    }

    /**
     * Checks whether the boss is left of the character's horizontal attack corridor.
     * @returns {boolean} True when the character is right of the boss corridor, otherwise false.
     */
    get isLeftFromCharacter() {
        if (!this.world?.character) return false;
        return this.world.character.x > this.x + this.offsetLeftPostionToCharacter;
    }
}
