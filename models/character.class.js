/**
 * Represents the player-controlled shark character.
 */
class Character extends MortalObject {
    height = 380;
    width = 280;
    x = 0;
    y = 100;
    cameraOffset = 50;
    speed = 10;
    levelLimitUp = -150;
    levelLimitDown = 160;
    lifeCount = 5;
    coinCount = 0;
    poisonBottleCount = 0;
    movementInterval = null;
    animateInterval = null;
    inactiveStartTime = Date.now();
    waitTime = 1000;
    sleepTime = 1500;
    sleepLoop = false;
    slap = false;
    hurtTime = 2;
    deathAnimationEnd = false;
    sinkDown = false;
    floatUp = false;
    floatUpEnded = false;
    sinkDownEnded = false;
    seabed = 100;

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

    collisionOffsetTopDefault = 180;
    collisionOffsetBottomDefault = 100;

    collisionOffsetTopSleep = 220;
    collisionOffsetBottomSleep = 50;

    /**
     * Initializes the character, loads all animation frames, and starts movement and animation loops.
     * @param {World} world Reference to the game world.
     * @param {UIController} uiController Reference to the UI controller.
     */
    constructor(world, uiController) {
        super();
        this.world = world;
        this.uiController = uiController;
        this.loadAllImages();
        this.movement();
        this.animate();
    }

    /**
     * Loads all animation frame sets required by the character.
     */
    loadAllImages() {
        this.loadImage(IMG_PATHS.character.idle[0]);
        this.loadImages(IMG_PATHS.character.swim);
        this.loadImages(IMG_PATHS.character.hurt.poison);
        this.loadImages(IMG_PATHS.character.hurt.shock);
        this.loadImages(IMG_PATHS.character.dead.poison);
        this.loadImages(IMG_PATHS.character.dead.shock);
        this.loadImages(IMG_PATHS.character.sleep);
        this.loadImages(IMG_PATHS.character.idle);
        this.loadImages(IMG_PATHS.character.attack.slap);
        this.loadImages(IMG_PATHS.character.attack.bubble.normal);
        this.loadImages(IMG_PATHS.character.attack.bubble.poison);
    }

    /**
     * Handles the movement of the character based on keyboard input.
     */
    movement() {
        this.movementInterval = setInterval(() => {
            if (this.world.isPaused) return;
            if (!this.world.control || !this.world.level) return;
            if (this.checkPlayerMovement()) return;
            if (this.checkSinkDownMovement()) return;
            if (this.checkFloatUpMovement()) return;
            this.checkDeathStopMovement();
        }, this.movementTickMs);
    }

    /**
     * Checks and handles the character's movement based on keyboard input.
     * @returns {boolean} True if the character moved, otherwise false.
     */
    checkPlayerMovement() {
        if (this.hasZeroLife) return;
        if (this.isGameStarted) return;
        if (this.sinkDown) return;
        this.moveHorizontal();
        this.moveVertical();
        this.moveCamera();
        return true;
    }

    /**
     * Moves the character left or right based on keyboard input.
     */
    moveHorizontal() {
        if (this.world.control.right && this.x < this.world.level.levelEnd_x) {
            this.x = Math.min(this.world.level.levelEnd_x, this.x + this.speed);
            this.otherDirection = false;
        } else if (this.world.control.left && this.x > this.world.level.levelStart_x) {
            this.x = Math.max(0, this.x - this.speed);
            this.otherDirection = true;
        }
    }

    /**
     * Moves the character up or down based on keyboard input.
     */
    moveVertical() {
        if (this.world.control.up && this.y >= this.levelLimitUp) {
            this.moveUp();
        } else if (this.world.control.down && this.y <= this.levelLimitDown) {
            this.moveDown();
        }
    }

    /**
     * Returns whether gameplay is currently inactive and movement/animation should be blocked.
     * @returns {boolean} True while the game is not active, false once gameplay has started.
     */
    get isGameStarted() {
        return !this.uiController.gameStarted;
    }

    /**
     * Checks and handles the character's sinking movement towards the seabed (death or sleep).
     * @returns {boolean} True if the character is currently sinking, otherwise false.
     */
    checkSinkDownMovement() {
        if (this.sinkDown && !this.sinkDownEnded) {
            this.moveDown(1);
            if (this.y >= this.seabed) {
                this.sinkDownEnded = true;
            }

            if (this.sinkDownEnded) {
                this.sinkDown = false;
            }
            return true;
        }
        return false;
    }

    /**
     * Checks and handles the character's death movement while floating upward.
     * @returns {boolean} True if the character is currently floating up, otherwise false.
     */
    checkFloatUpMovement() {
        if (this.floatUp && !this.floatUpEnded) {
            this.moveUp(1);
            if (this.y <= -500) {
                this.floatUpEnded = true;
            }
            return true;
        }
        return false;
    }

    /**
     * Finalizes character death movement by disabling game input/state and stopping movement updates.
     * @returns {boolean} True if the character's death movement has ended, otherwise false.
     */
    checkDeathStopMovement() {
        if ((this.sinkDownEnded || this.floatUpEnded) && this.deathAnimationEnd) {
            this.world.uiController.gameStarted = false;
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
            if (this.world.isPaused) return;
            if (this.isGameStarted) return;
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
     * Checks and handles the animation state for the character's death sequence.
     * @returns {boolean} True if the death sequence is active, otherwise false.
     */
    checkDeath() {
        if (this.hasZeroLife) {
            this.stopSnoring();
            AUDIO_PATHS.character.hurt.play();
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
        if (this.isHurt) {
            this.stopSnoring();
            AUDIO_PATHS.character.hurt.play();
            this.playHurtTypeAnimation();
            this.wakeUp();
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
            this.world.control.right ||
            this.world.control.left ||
            this.world.control.up ||
            this.world.control.down
        ) {
            this.stopSnoring();
            this.wakeUp();
            this.slap = false;
            this.createBubble.isActive = false;
            this.playAnimation(IMG_PATHS.character.swim);
            return true;
        }
        return false;
    }

    /**
     * Checks and handles the animation state for the character's slap action.
     * @returns {boolean} True if the character is performing a slap action, otherwise false.
     */
    checkSlap() {
        if (this.world.control.spacebar) {
            this.slap = true;
        }
        if (this.slap) {
            this.stopSnoring();
            this.wakeUp();
            this.playSlapAnimation();
            return true;
        }
        return false;
    }

    /**
     * Plays the slap animation, widens the collision box on the attacking side, and resets both when done.
     */
    playSlapAnimation() {
        AUDIO_PATHS.character.slap.play();
        let animationEnd = this.playAnimation(IMG_PATHS.character.attack.slap);
        if (animationEnd) {
            this.slap = false;
        }
    }

    /**
     * Checks and handles the animation state for the character's bubble creation action.
     * @returns {boolean} True if the character is creating a bubble, otherwise false.
     */
    checkCreateBubble() {
        if (this.world.control.d) {
            this.createBubble.isActive = true;
        }
        if (this.createBubble.isActive) {
            this.stopSnoring();
            this.wakeUp();
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
            this.createBubble.images = IMG_PATHS.character.attack.bubble.poison;
        } else {
            this.createBubble.images = IMG_PATHS.character.attack.bubble.normal;
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
            AUDIO_PATHS.character.snoring.play();
            return true;
        } else if (this.isInactive() >= this.waitTime) {
            this.playWaitAnimation();
            return true;
        }
        return false;
    }

    /**
     * Stops the snoring sound.
     */
    stopSnoring() {
        AUDIO_PATHS.character.snoring.stop();
    }

    /**
     * Plays the death animation based on the type of damage that caused the character's death (poison or shock).
     */
    playDeathTypeAnimation() {
        if (this.enemyDamageType === "poison") {
            this.deathAnimationEnd = this.playAnimation(IMG_PATHS.character.dead.poison);
            if (this.deathAnimationEnd) {
                this.floatUp = true;
            }
        } else if (this.enemyDamageType === "shock") {
            this.deathAnimationEnd = this.playAnimation(IMG_PATHS.character.dead.shock);
            if (this.deathAnimationEnd) {
                this.sinkDown = true;
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
            this.playAnimation(IMG_PATHS.character.hurt.poison);
        } else if (this.enemyDamageType === "shock") {
            this.playAnimation(IMG_PATHS.character.hurt.shock);
        }
    }

    /**
     * Plays the wait animation for the character when it is idle.
     */
    playWaitAnimation() {
        this.playAnimation(IMG_PATHS.character.idle);
    }

    /**
     * Plays the sleep animation — delegates to loop or intro phase.
     */
    playSleepAnimation() {
        if (this.sleepLoop) {
            this.playSleepLoopAnimation();
        } else {
            this.playSleepIntroAnimation();
        }
    }

    /**
     * Loops the sleep animation from frame 10 onwards, skipping the intro frames.
     */
    playSleepLoopAnimation() {
        if (this.currentImage == 0) {
            this.currentImage = 10;
        }
        this.playAnimation(IMG_PATHS.character.sleep);
    }

    /**
     * Plays the sleep intro once, triggering sink and collision offset shift at set frames.
     */
    playSleepIntroAnimation() {
        let animationEnd = this.playAnimation(IMG_PATHS.character.sleep);
        if (this.currentImage == 4) {
            this.sinkDown = true;
        }
        if (this.currentImage == 9) {
            this.collisionOffset.top = this.collisionOffsetTopSleep;
            this.collisionOffset.bottom = this.collisionOffsetBottomSleep;
        }
        if (animationEnd) {
            this.sleepLoop = true;
        }
    }

    /**
     * Resets all sleep and sink state, marking the character as active again.
     */
    wakeUp() {
        this.inactiveStartTime = Date.now();
        this.sleepLoop = false;
        this.sinkDown = false;
        this.sinkDownEnded = false;
        this.collisionOffset.top = this.collisionOffsetTopDefault;
        this.collisionOffset.bottom = this.collisionOffsetBottomDefault;
        this.collisionOffset.left = this.collisionOffsetSideDefault;
        this.collisionOffset.right = this.collisionOffsetSideDefault;
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
        if (this.x <= endboss.x) {
            this.world.camera_x = -this.x + this.cameraOffset;
        } else if (this.x >= endboss.x + bossFightCameraOffset) {
            this.world.camera_x = -this.x + bossFightCameraOffset;
        }
    }

    /**
     * Plays the default image for the character when no other state has priority.
     */
    defaultImageShark() {
        this.loadImage(IMG_PATHS.character.idle[0]);
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

    /**
     * @returns {boolean} True when the character has maximum life.
     */
    get fullLife() {
        return this.lifeCount >= 5;
    }
}
