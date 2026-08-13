/**
 * Extends Character with animation and idle-state helpers.
 * This file must load after character.class.js and before Character is instantiated.
 */
Character.prototype.animate = function () {
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
};

/**
 * Checks and handles the character's death animation.
 * @returns {boolean} True while the death sequence is active.
 */
Character.prototype.checkDeath = function () {
    if (!this.hasZeroLife) return false;
    this.stopSnoring();
    AUDIO_PATHS.character.hurt.stop();
    this.playDeathTypeAnimation();
    return true;
};

/**
 * Checks and handles the character's hurt animation.
 * @returns {boolean} True while the character is hurt.
 */
Character.prototype.checkHurt = function () {
    if (!this.isHurt) return false;
    this.stopSnoring();
    AUDIO_PATHS.character.hurt.play();
    this.playHurtTypeAnimation();
    this.wakeUp();
    return true;
};

/**
 * Checks and handles swimming input and resets active attacks.
 * @returns {boolean} True while swimming input is active.
 */
Character.prototype.checkSwimming = function () {
    if (!this.world.control.right && !this.world.control.left && !this.world.control.up && !this.world.control.down) {
        return false;
    }
    this.stopSnoring();
    this.slapHitWindow = false;
    this.wakeUp();
    this.slap = false;
    this.createBubble.isActive = false;
    this.playAnimation(IMG_PATHS.character.swim);
    return true;
};

/**
 * Checks and handles the character's slap action.
 * @returns {boolean} True while the slap action is active.
 */
Character.prototype.checkSlap = function () {
    if (this.world.gameEnd) return false;
    if (this.world.control.spacebar) this.slap = true;
    if (!this.slap) return false;
    this.stopSnoring();
    this.wakeUp();
    this.playSlapAnimation();
    return true;
};

/**
 * Plays the slap animation and manages its hit window.
 */
Character.prototype.playSlapAnimation = function () {
    AUDIO_PATHS.character.slap.play();
    const animationEnd = this.playAnimation(IMG_PATHS.character.attack.slap);
    if (this.currentImage >= 4) this.slapHitWindow = true;
    if (animationEnd) {
        this.slap = false;
        this.slapHitWindow = false;
    }
};

/**
 * Checks and handles the character's bubble creation action.
 * @returns {boolean} True while bubble creation is active.
 */
Character.prototype.checkCreateBubble = function () {
    if (this.world.gameEnd) return false;
    if (this.world.control.d) this.createBubble.isActive = true;
    if (!this.createBubble.isActive) return false;
    this.stopSnoring();
    this.wakeUp();
    this.playCreateBubbleAnimation();
    return true;
};

/**
 * Plays the bubble creation animation and spawns the bubble on completion.
 */
Character.prototype.playCreateBubbleAnimation = function () {
    this.createBubble.images = this.poisonBottleCount > 0 ? IMG_PATHS.character.attack.bubble.poison : IMG_PATHS.character.attack.bubble.normal;
    const animationEnd = this.playAnimation(this.createBubble.images);
    if (animationEnd) {
        this.createBubble.isActive = false;
        this.world.spawnBubble();
    }
};

/**
 * Checks whether the character should wait or sleep while inactive.
 * @returns {boolean} True while an idle animation is active.
 */
Character.prototype.checkIdle = function () {
    if (this.isInactive() >= this.sleepTime) {
        this.playSleepAnimation();
        AUDIO_PATHS.character.snoring.play();
        return true;
    }
    if (this.isInactive() >= this.waitTime) {
        this.playWaitAnimation();
        return true;
    }
    return false;
};

/**
 * Stops the character's snoring audio.
 */
Character.prototype.stopSnoring = function () {
    AUDIO_PATHS.character.snoring.stop();
};

/**
 * Plays the death animation for the current enemy damage type.
 */
Character.prototype.playDeathTypeAnimation = function () {
    if (this.enemyDamageType === "poison") {
        this.deathAnimationEnd = this.playAnimation(IMG_PATHS.character.dead.poison);
        if (this.deathAnimationEnd) this.floatUp = true;
    } else if (this.enemyDamageType === "shock") {
        this.deathAnimationEnd = this.playAnimation(IMG_PATHS.character.dead.shock);
        if (this.deathAnimationEnd) this.sinkDown = true;
    }
    if (this.deathAnimationEnd) this.stopAnimationInterval();
};

/**
 * Plays the hurt animation for the current enemy damage type.
 */
Character.prototype.playHurtTypeAnimation = function () {
    if (this.enemyDamageType === "poison") {
        this.playAnimation(IMG_PATHS.character.hurt.poison);
    } else if (this.enemyDamageType === "shock") {
        this.playAnimation(IMG_PATHS.character.hurt.shock);
    }
};

/**
 * Plays the character's waiting animation.
 */
Character.prototype.playWaitAnimation = function () {
    this.playAnimation(IMG_PATHS.character.idle);
};

/**
 * Selects the appropriate sleep animation phase.
 */
Character.prototype.playSleepAnimation = function () {
    if (this.sleepLoop) {
        this.playSleepLoopAnimation();
    } else {
        this.playSleepIntroAnimation();
    }
};

/**
 * Plays the looping part of the sleep animation.
 */
Character.prototype.playSleepLoopAnimation = function () {
    if (this.currentImage == 0) this.currentImage = 10;
    this.playAnimation(IMG_PATHS.character.sleep);
};

/**
 * Plays the introductory part of the sleep animation.
 */
Character.prototype.playSleepIntroAnimation = function () {
    const animationEnd = this.playAnimation(IMG_PATHS.character.sleep);
    if (this.currentImage == 4) this.sinkDown = true;
    if (this.currentImage == 9) {
        this.collisionOffset.top = this.collisionOffsetTopSleep;
        this.collisionOffset.bottom = this.collisionOffsetBottomSleep;
    }
    if (animationEnd) this.sleepLoop = true;
};

/**
 * Resets sleep state and restores the default collision offsets.
 */
Character.prototype.wakeUp = function () {
    this.inactiveStartTime = Date.now();
    this.sleepLoop = false;
    this.sinkDown = false;
    this.sinkDownEnded = false;
    this.collisionOffset.top = this.collisionOffsetTopDefault;
    this.collisionOffset.bottom = this.collisionOffsetBottomDefault;
};

/**
 * Returns the elapsed inactive time in milliseconds.
 * @returns {number} Elapsed inactive time.
 */
Character.prototype.isInactive = function () {
    return Date.now() - this.inactiveStartTime;
};

/**
 * Loads the default idle image.
 */
Character.prototype.defaultImageShark = function () {
    this.loadImage(IMG_PATHS.character.idle[0]);
};

/**
 * Loads the final frame of an animation sequence.
 * @param {string[]} images Animation frame paths.
 */
Character.prototype.lastFrame = function (images) {
    this.loadImage(images.at(-1));
};
