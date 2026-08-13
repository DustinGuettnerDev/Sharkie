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
    sleepTime = 15000;
    sleepLoop = false;
    slap = false;
    hurtTime = 2;
    deathAnimationEnd = false;
    sinkDown = false;
    floatUp = false;
    floatUpEnded = false;
    sinkDownEnded = false;
    seabed = 100;
    slapHitWindow = false;

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
     * Marks gameplay inactive after the character's death movement has ended.
     * @returns {boolean} True if the character's death movement has ended, otherwise false.
     */
    checkDeathStopMovement() {
        if ((this.sinkDownEnded || this.floatUpEnded) && this.deathAnimationEnd) {
            this.world.uiController.gameStarted = false;
            return true;
        }
        return false;
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
