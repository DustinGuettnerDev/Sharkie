/**
 * Class representing the endboss enemy in the game.
 */
class Endboss extends Enemy {
    imagesSwimming = [
        "img/2.Enemy/3 Final Enemy/2.floating/1.png",
        "img/2.Enemy/3 Final Enemy/2.floating/2.png",
        "img/2.Enemy/3 Final Enemy/2.floating/3.png",
        "img/2.Enemy/3 Final Enemy/2.floating/4.png",
        "img/2.Enemy/3 Final Enemy/2.floating/5.png",
        "img/2.Enemy/3 Final Enemy/2.floating/6.png",
        "img/2.Enemy/3 Final Enemy/2.floating/7.png",
        "img/2.Enemy/3 Final Enemy/2.floating/8.png",
        "img/2.Enemy/3 Final Enemy/2.floating/9.png",
        "img/2.Enemy/3 Final Enemy/2.floating/10.png",
        "img/2.Enemy/3 Final Enemy/2.floating/11.png",
        "img/2.Enemy/3 Final Enemy/2.floating/12.png",
        "img/2.Enemy/3 Final Enemy/2.floating/13.png",
    ];

    imagesAppear = [
        "img/2.Enemy/3 Final Enemy/1.Introduce/1.png",
        "img/2.Enemy/3 Final Enemy/1.Introduce/2.png",
        "img/2.Enemy/3 Final Enemy/1.Introduce/3.png",
        "img/2.Enemy/3 Final Enemy/1.Introduce/4.png",
        "img/2.Enemy/3 Final Enemy/1.Introduce/5.png",
        "img/2.Enemy/3 Final Enemy/1.Introduce/6.png",
        "img/2.Enemy/3 Final Enemy/1.Introduce/7.png",
        "img/2.Enemy/3 Final Enemy/1.Introduce/8.png",
        "img/2.Enemy/3 Final Enemy/1.Introduce/9.png",
        "img/2.Enemy/3 Final Enemy/1.Introduce/10.png",
    ];

    imagesAttack = [
        "img/2.Enemy/3 Final Enemy/Attack/1.png",
        "img/2.Enemy/3 Final Enemy/Attack/2.png",
        "img/2.Enemy/3 Final Enemy/Attack/3.png",
        "img/2.Enemy/3 Final Enemy/Attack/4.png",
        "img/2.Enemy/3 Final Enemy/Attack/5.png",
        "img/2.Enemy/3 Final Enemy/Attack/6.png",
    ];

    imagesHurt = [
        "img/2.Enemy/3 Final Enemy/Hurt/1.png",
        "img/2.Enemy/3 Final Enemy/Hurt/2.png",
        "img/2.Enemy/3 Final Enemy/Hurt/3.png",
        "img/2.Enemy/3 Final Enemy/Hurt/4.png",
    ];

    imagesDeath = [
        "img/2.Enemy/3 Final Enemy/Dead/Mesa de trabajo 2 copia 6.png",
        "img/2.Enemy/3 Final Enemy/Dead/Mesa de trabajo 2 copia 7.png",
        "img/2.Enemy/3 Final Enemy/Dead/Mesa de trabajo 2 copia 8.png",
        "img/2.Enemy/3 Final Enemy/Dead/Mesa de trabajo 2 copia 9.png",
        "img/2.Enemy/3 Final Enemy/Dead/Mesa de trabajo 2 copia 10.png",
    ];

    height = 600;
    width = 600;
    animateInterval = null;
    movementInterval = null;
    x = 3400;
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
    appearingPositionTrigger = 3000;
    appearAnimationStarted = false;
    appearAnimationEnd = false;
    startTime = Date.now();
    timeTillAttack = 1;
    attackMove = false;
    offsetYPositionToCharacter = 160;
    offsetRightPositionToCharacter = -80;
    offsetLeftPostionToCharacter = 400;
    deathRiseUpEnded = false;

    /**
     * Constructor for the Endboss class.
     * Initializes the endboss by loading images and starting animations and movement.
     */
    constructor() {
        super();
        this.loadImages(this.imagesSwimming);
        this.loadImages(this.imagesAttack);
        this.loadImages(this.imagesHurt);
        this.loadImages(this.imagesDeath);
        this.loadImages(this.imagesAppear);
        this.animate();
        this.movement();
    }

    /**
     * Handles the movement of the endboss.
     * Checks for death, attack, and character position to determine movement direction.
     */
    movement() {
        this.movementInterval = setInterval(() => {
            if (!this.world?.character) return;
            if (this.checkDeathMovement()) return;
            if (this.checkDeathEndMovement()) return;
            if (this.checkAttackMovement()) return;
        }, this.movementTickMs);
    }

    /**
     * Moves the boss upward during the death sequence until it leaves the screen.
     * @returns {boolean} True while death movement is applied, otherwise false.
     */
    checkDeathMovement() {
        if (this.death && !this.deathRiseUpEnded) {
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
        if (this.death) {
            this.attackMove = false;
            this.stopMovementInterval();
            return true;
        }
        return false;
    }

    /**
     * Moves the boss toward the character while an attack movement is active.
     * @returns {boolean} True while attack movement is active, otherwise false.
     */
    checkAttackMovement() {
        if (this.attackMove) {
            if (this.isAboveCharacter()) {
                this.moveDown();
            } else if (this.isBelowCharacter()) {
                this.moveUp();
            }
            if (this.isRightFromCharacter()) {
                this.otherDirection = false;
                this.moveLeft();
            } else if (this.isLeftFromCharacter()) {
                this.otherDirection = true;
                this.moveRight();
            }
            return true;
        }
        return false;
    }

    /**
     * Controls animation state priority for appear, death, hurt, and attack.
     */
    animate() {
        this.animateInterval = setInterval(() => {
            if (this.checkAppearing()) return;
            if (this.checkDeath()) return;
            if (this.checkHurt()) return;
            if (this.checkAttackTimer()) return;
            this.defaultImageEndboss();
        }, this.animationTicksMs);
    }

    /**
     * Plays the intro animation until it is completed once.
     * @returns {boolean} True while intro handling blocks other animations, otherwise false.
     */
    checkAppearing() {
        if (!this.appearAnimationEnd) {
            if (this.isAppearing() || this.appearAnimationStarted) {
                this.appearAnimationEnd = this.playAnimation(this.imagesAppear);
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
        if (this.death) {
            this.playDeathAnimation(this.imagesDeath);
            return true;
        }
        return false;
    }

    /**
     * Plays the hurt animation while the boss is in hurt state.
     * @returns {boolean} True when hurt animation is active, otherwise false.
     */
    checkHurt() {
        if (this.isHurt()) {
            this.playAnimation(this.imagesHurt);
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
            this.attackAnimationEnd = this.playAnimation(this.imagesAttack);
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
        this.playAnimation(this.imagesSwimming);
    }

    /**
     * Runs death animation once and stops animation loop afterward.
     */
    playDeathAnimation() {
        if (this.deathAnimationEnd) return;
        this.deathAnimationEnd = this.playAnimation(this.imagesDeath);
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
     * Returns true once the character reached the trigger position for intro.
     * @returns {boolean} True when the intro trigger position is reached, otherwise false.
     */
    isAppearing() {
        if (!this.world?.character) return false;
        return this.world.character.x >= this.appearingPositionTrigger;
    }

    /**
     * Returns true when enough time passed to start the next attack.
     * @returns {boolean} True when attack cooldown has elapsed, otherwise false.
     */
    attackTimer() {
        let timepassed = (Date.now() - this.startTime) / 1000;
        return timepassed > this.timeTillAttack;
    }

    /**
     * Checks if the character is above the boss to attack.
     * @returns {boolean} True when the character is above the boss, otherwise false.
     */
    isBelowCharacter() {
        if (!this.world?.character) return false;
        return this.world.character.y < this.y + this.offsetYPositionToCharacter;
    }

    /**
     * Checks if the character is below the boss to attack.
     * @returns {boolean} True when the character is below the boss, otherwise false.
     */
    isAboveCharacter() {
        if (!this.world?.character) return false;
        return this.world.character.y > this.y + this.offsetYPositionToCharacter;
    }

    /**
     * Checks if the character is to the left of the boss attack corridor.
     * @returns {boolean} True when the character is left of the boss corridor, otherwise false.
     */
    isRightFromCharacter() {
        if (!this.world?.character) return false;
        return this.world.character.x < this.x + this.offsetRightPositionToCharacter;
    }

    /**
     * Checks if the character is to the right of the boss attack corridor.
     * @returns {boolean} True when the character is right of the boss corridor, otherwise false.
     */
    isLeftFromCharacter() {
        if (!this.world?.character) return false;
        return this.world.character.x > this.x + this.offsetLeftPostionToCharacter;
    }
}
