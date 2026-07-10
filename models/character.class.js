class Character extends MortalObject {
    imagesSwimming = IMG_PATHS.character.swimming;
    imagesHurtShock = IMG_PATHS.character.hurtShock;
    imagesHurtPoison = IMG_PATHS.character.hurtPoison;
    imagesPoisonDeath = IMG_PATHS.character.poisonDeath;
    imagesShockDeath = IMG_PATHS.character.shockDeath;
    imagesWait = IMG_PATHS.character.wait;
    imagesSleep = IMG_PATHS.character.sleep;
    imagesSlap = IMG_PATHS.character.slap;
    imagesCreateBubble = IMG_PATHS.character.createBubble;
    imagesCreateBubblePoison = IMG_PATHS.character.createBubblePoison;

    height = 380;
    width = 280;
    x = 0;
    y = 100;
    world = null;

    speed = 20;
    levelLimitUp = -150;
    levelLimitDown = 160;
    lifeCount = 2;
    coinCount = 0;
    poisonBottleCount = 0;
    movementInterval = null;
    animateInterval = null;
    inactiveStartTime = Date.now();
    waitTime = 5000;
    sleepTime = 15000;
    sleepAnimationFinished = false;
    slap = false;
    hurtTime = 2;
    deathAnimationEnd = false;
    deathFallDown = false;
    deathRiseUp = false;
    deathRiseUpEnded = false;
    deathFallDownEnded = false;

    createBubble = {
        isActive: false,
        images: null,
    };

    collisionOffset = {
        top: 180,
        bottom: 100,
        left: 55,
        right: 55,
    };

    constructor(world = null) {
        super();
        this.world = world;
        /*super() ruft den Konstruktor der Elternklasse auf;
        in einer abgeleiteten Klasse muss das vor this passieren.*/
        this.loadImage(this.imagesWait[0]);
        this.loadImages(this.imagesSwimming);
        this.loadImages(this.imagesHurtPoison);
        this.loadImages(this.imagesHurtShock);
        this.loadImages(this.imagesPoisonDeath);
        this.loadImages(this.imagesShockDeath);
        this.loadImages(this.imagesSleep);
        this.loadImages(this.imagesWait);
        this.loadImages(this.imagesSlap);
        this.loadImages(this.imagesCreateBubble);
        this.loadImages(this.imagesCreateBubblePoison);
        this.movement();
        this.animate();
        /*         this.calculateCollisionOffset(); */
    }

    /**
     * Handles the movement of the character based on keyboard input.
     */
    movement() {
        this.movementInterval = setInterval(() => {
            if (!this.world?.keyboard || !this.world?.level) return;
            if (this.checkPlayerMovement()) return;
            if (this.checkDeathFallDownMovement()) return;
            if (this.checkDeathRiseUpMovement()) return;
            this.checkDeathStopMovement();
        }, this.movementTickMs);
    }

    /**
     * Checks and handles the character's movement based on keyboard input.
     * @returns {boolean} True if the character moved, otherwise false.
     */
    checkPlayerMovement() {
        if (this.hasZeroLife()) return false;
        if (this.world.keyboard.right && this.x < this.world.level.levelEnd_x) {
            this.x = Math.min(this.world.level.levelEnd_x, this.x + this.speed);
            this.otherDirection = false;
        } else if (this.world.keyboard.left && this.x > this.world.level.levelStart_x) {
            this.x = Math.max(0, this.x - this.speed);
            this.otherDirection = true;
        }
        if (this.world.keyboard.up && this.y >= this.levelLimitUp) {
            this.moveUp();
        } else if (this.world.keyboard.down && this.y <= this.levelLimitDown) {
            this.moveDown();
        }
        this.moveCamera();
        return true;
    }

    /**
     * Checks and handles the character's death movement when falling down.
     * @returns {boolean} True if the character is in death fall down movement, otherwise false.
     */
    checkDeathFallDownMovement() {
        if (this.deathFallDown && !this.deathFallDownEnded) {
            this.moveDown(1);
            if (this.y >= 100) {
                this.deathFallDownEnded = true;
            }
            return true;
        }
        return false;
    }

    /**
     * Checks and handles the character's death movement when rising up.
     * @returns {boolean} True if the character is in death rise up movement, otherwise false.
     */
    checkDeathRiseUpMovement() {
        if (this.deathRiseUp && !this.deathRiseUpEnded) {
            this.moveUp(1);
            if (this.y > -500) {
                this.deathRiseUpEnded = true;
            }
            return true;
        }
        return false;
    }

    /**
     * Checks and handles if the character's death movement should stop.
     * @returns {boolean} True if the character's death movement has ended, otherwise false.
     */
    checkDeathStopMovement() {
        if (this.deathFallDownEnded || this.deathRiseUpEnded) {
            this.stopMovementInterval();
            return true;
        }
        return false;
    }

    /**
     * Handles the animation of the character based on its current state (e.g., swimming, hurt, creating bubble, etc.).
     */
    animate() {
        this.animateInterval = setInterval(() => {
            if (!this.world?.keyboard) return;
            if (this.checkDeath()) return;
            if (this.checkHurt()) return;
            if (this.checkSwimming()) return;
            if (this.checkSlap()) return;
            if (this.checkCreateBubble()) return;
            if (this.checkIdle()) return;
            this.defaultImageShark();
        }, this.animationTicksMs);
    }

    /**
     * Checks and handles the animation state for the character's death.
     * @returns {boolean} True if the character is in death state, otherwise false.
     */
    checkDeath() {
        if (this.hasZeroLife()) {
            this.playDeathTypeAnimation();
            return true;
        }
        return false;
    }

    /**
     * Checks and handles the animation state for the character's hurt state.
     * @returns {boolean} True if the character is hurt, otherwise false.
     */
    checkHurt() {
        if (this.isHurt()) {
            this.playHurtTypeAnimation();
            this.startSleepCounter();
            return true;
        }
        return false;
    }

    /**
     * Checks and handles the animation state for the character's swimming state
     * @returns {boolean} True if the character is swimming, otherwise false.
     */
    checkSwimming() {
        if (
            this.world.keyboard.right ||
            this.world.keyboard.left ||
            this.world.keyboard.up ||
            this.world.keyboard.down
        ) {
            this.startSleepCounter();
            this.slap = false;
            this.createBubble.isActive = false;
            this.playAnimation(this.imagesSwimming);
            return true;
        }
        return false;
    }

    /**
     * Checks and handles the animation state for the character's slap action.
     * @returns {boolean} True if the character is performing a slap action, otherwise false.
     */
    checkSlap() {
        if (this.world.keyboard.spacebar) {
            this.slap = true;
        }
        if (this.slap) {
            this.startSleepCounter();
            this.playSlapAnimation();
            return true;
        }
        return false;
    }

    /**
     * Plays the slap animation for the character and resets the slap state when the animation ends.
     */
    playSlapAnimation() {
        let animationEnd = this.playAnimation(this.imagesSlap);
        if (animationEnd) {
            this.slap = false;
        }
    }

    /**
     * Checks and handles the animation state for the character's bubble creation action.
     * @returns {boolean} True if the character is creating a bubble, otherwise false.
     */
    checkCreateBubble() {
        if (this.world.keyboard.d) {
            this.createBubble.isActive = true;
        }
        if (this.createBubble.isActive) {
            this.startSleepCounter();
            this.playCreateBubbleAnimation();
            return true;
        }
        return false;
    }

    /**
     * Plays the animation for creating a bubble and spawns a bubble when the animation ends.
     */
    playCreateBubbleAnimation() {
        if (this.poisonBottleCount > 0) {
            this.createBubble.images = this.imagesCreateBubblePoison;
        } else {
            this.createBubble.images = this.imagesCreateBubble;
        }

        let animationEnd = this.playAnimation(this.createBubble.images);
        if (animationEnd) {
            this.createBubble.isActive = false;
            this.world.spawnBubble();
        }
    }

    /**
     * Checks and handles the animation state for the character's idle state (waiting or sleeping).
     * @returns {boolean} True if the character is idle, otherwise false.
     */
    checkIdle() {
        if (this.isInactive() >= this.sleepTime) {
            this.playSleepAnimation();
            return true;
        } else if (this.isInactive() >= this.waitTime) {
            this.playWaitAnimation();
            return true;
        }
        return false;
    }

    /**
     * Plays the death animation based on the type of damage that caused the character's death (poison or shock).
     */
    playDeathTypeAnimation() {
        if (this.enemyDamageType === "poison") {
            this.deathAnimationEnd = this.playAnimation(this.imagesPoisonDeath);
            if (this.deathAnimationEnd) {
                this.deathRiseUp = true;
            }
        } else if (this.enemyDamageType === "shock") {
            this.deathAnimationEnd = this.playAnimation(this.imagesShockDeath);
            if (this.deathAnimationEnd) {
                this.deathFallDown = true;
            }
        }
        if (this.deathAnimationEnd) {
            this.stopAnimationInterval();
        }
    }

    /**
     * Plays the hurt animation based on the type of damage that caused the character's hurt state (poison or shock).
     */
    playHurtTypeAnimation() {
        if (this.enemyDamageType === "poison") {
            this.playAnimation(this.imagesHurtPoison);
        } else if (this.enemyDamageType === "shock") {
            this.playAnimation(this.imagesHurtShock);
        }
    }

    /**
     * Plays the Wait animation for the character when it is idle.
     */
    playWaitAnimation() {
        this.playAnimation(this.imagesWait);
    }

    /**
     * Plays the Sleep animation for the character when it is idle for an extended period.
     */
    playSleepAnimation() {
        if (this.sleepAnimationFinished) {
            this.lastFrame(this.imagesSleep);
            return;
        }

        let animationEnd = this.playAnimation(this.imagesSleep);
        if (animationEnd) {
            this.sleepAnimationFinished = true;
            this.lastFrame(this.imagesSleep);
        }
    }

    /**
     * Starts the sleep counter for the character, marking the time when it became inactive.
     */
    startSleepCounter() {
        this.inactiveStartTime = Date.now();
        this.sleepAnimationFinished = false;
    }

    /**
     * Checks if the character is inactive based on the difference between the current time and the last inactive start time.
     * @returns {number} The time in milliseconds since the character became inactive.
     */
    isInactive() {
        return Date.now() - this.inactiveStartTime;
    }

    /**
     * Moves the camera based on the character's position relative to the endboss's position in the level.
     */
    moveCamera() {
        const endboss = this.world.level.endboss;
        const bossFightCameraOffset = 380;
        // If the charater is <= the position of the endboss, move the camera with value -this.x to the left.
        if (this.x <= endboss.x) {
            this.world.camera_x = -this.x;
            // If the character is >= the position of the endboss + offset, move the camera to the right with a the same offset.
        } else if (this.x >= endboss.x + bossFightCameraOffset) {
            this.world.camera_x = -this.x + bossFightCameraOffset;
            // If the character is between the first two conditions, do not move the camera, keeping it fixed at the endboss position.
            // this.world.camera_x = -endboss.x;
        } else {
            return;
        }
    }

    /**
     * Plays the default image for the character when no other state has priority.
     */
    defaultImageShark() {
        this.loadImage(this.imagesWait[0]);
    }

    /**
     * Displays the last frame of the given animation sequence.
     * @param {string[]} images Animation frame paths.
     */
    lastFrame(images) {
        this.loadImage(images.at(-1));
    }

    /**
     * Handles the character getting hit by an enemy.
     * @param {Enemy} enemy Enemy instance that hit the character.
     */
    getHit(enemy) {
        super.getHit();
        this.lastHit = Date.now();
        this.enemyDamageType = this.getEnemyDamageType(enemy);
    }
}
