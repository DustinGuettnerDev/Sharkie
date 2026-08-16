/**
 * Represents the game world and coordinates game state, rendering, collisions, and loops.
 */
class World {
    character = null;
    HUD = [];
    ctx = null;
    canvas = null;
    control = null;
    collisionInterval = null;
    renderFrameId = null;
    camera_x = 0;
    bubbles = [];
    testMode = false;
    coinsTillLife = 7;
    maxPoisonBottleCollected = 2;
    gameEnd = false;
    isPaused = false;
    uiController = null;
    level = null;
    locStorage = null;
    collisionTickMs = 200;

    /**
     * Creates the game world and immediately sets up rendering and collision loops.
     * @param {HTMLCanvasElement} canvas The canvas used for rendering.
     * @param {Control} control The keyboard and touch input controller.
     * @param {UIController} uiController The UI layer controlling overlays and buttons.
     * @param {LocalStorage} locStorage Persistent storage for game settings.
     */
    constructor(canvas, control, uiController, locStorage) {
        this.validateWorldDependencies(canvas, control);
        this.canvas = canvas;
        this.ctx = this.createRenderingContext(canvas);
        this.uiController = uiController;
        this.locStorage = locStorage;
        this.initializeLevelState(control);
        this.startWorldLoops();
    }

    /**
     * Validates that the canvas and control dependencies are available.
     * @param {HTMLCanvasElement} canvas The game canvas.
     * @param {Control} control The input control object.
     */
    validateWorldDependencies(canvas, control) {
        if (!canvas || typeof canvas.getContext !== "function") {
            throw new Error("World initialization failed: canvas is missing or does not provide getContext('2d').");
        }
        if (!control) {
            throw new Error("World initialization failed: keyboard input object is required.");
        }
    }

    /**
     * Creates the 2D rendering context for the canvas.
     * @param {HTMLCanvasElement} canvas The canvas element to render to.
     * @returns {CanvasRenderingContext2D} The 2D drawing context.
     */
    createRenderingContext(canvas) {
        const ctx = canvas.getContext("2d");
        if (!ctx) {
            throw new Error("World initialization failed: could not create 2D rendering context.");
        }
        return ctx;
    }

    /**
     * Initializes the active level, character, HUD, and world references.
     * @param {Control} control The active input controller.
     */
    initializeLevelState(control) {
        this.level = createLevel_1();
        this.control = control;
        this.character = new Character(this, this.uiController);
        this.HUD = createHud(this, this.character);
        this.setAttributes();
    }

    /**
     * Starts the render loop and the periodic collision check loop.
     */
    startWorldLoops() {
        this.render();
        this.checkCollisionsOrAggroRange();
    }

    /**
     * Assigns the world reference to all level enemies and the end boss.
     */
    setAttributes() {
        for (let enemy of this.level.regularEnemies) {
            enemy.world = this;
        }
        this.level.endboss.world = this;
    }

    /**
     * Re-renders the world frame until the game is paused or finished.
     */
    render() {
        if (this.isPaused) {
            this.renderFrameId = null;
            return;
        }
        this.drawWorldFrame();
        if (this.isPaused) return;
        this.renderFrameId = requestAnimationFrame(() => this.render());
    }

    /**
     * Clears the canvas, updates game-over checks, draws the scrollable world, and re-adds HUD overlays.
     */
    drawWorldFrame() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.checkGameEnd();
        this.ctx.translate(this.camera_x, 0);
        this.drawScrollableWorldLayers();
        this.ctx.translate(-this.camera_x, 0);
        this.addHudToMap();
    }

    /**
     * Draws all visible background, collectible, bubble, enemy, and player objects in the current frame.
     */
    drawScrollableWorldLayers() {
        this.addObjectsToMap(this.level.backgroundObjects);
        this.addObjectsToMap(this.isVisibleFilterPB(this.level.collectibles));
        this.addObjectsToMap(this.bubbles);
        this.addObjectsToMap(this.level.enemies);
        this.addToMap(this.character);
    }

    /**
     * Starts the periodic interval that checks enemy, collectible, and bubble collisions.
     */
    checkCollisionsOrAggroRange() {
        this.stopCollisionInterval();
        this.collisionInterval = setInterval(() => {
            if (this.isPaused || this.gameEnd || this.character.hasZeroLife) return;
            this.enemyCollision();
            this.collectibleCollision();
            this.bubbleCollision();
        }, this.collisionTickMs);
    }

    /**
     * Clears any existing collision interval before creating a new one.
     */
    stopCollisionInterval() {
        if (this.collisionInterval) {
            clearInterval(this.collisionInterval);
            this.collisionInterval = null;
        }
    }

    /**
     * Checks enemy contact and resolves slap hits or player damage.
     */
    enemyCollision() {
        for (let enemy of this.level.enemies) {
            if (this.character.isColliding(enemy) && !this.character.hasZeroLife && !this.character.isHurt && enemy.dead !== true) {
                if (this.character.slapHitWindow === true) {
                    this.enemySlapCollision(enemy);
                } else if (!this.testMode && !this.character.slap) {
                    this.character.getHit(enemy);
                }
            }
        }
    }

    /**
     * Applies damage from a slap attack when the enemy is vulnerable to it.
     * @param {Enemy} enemy The enemy hit by the player's slap.
     */
    enemySlapCollision(enemy) {
        AUDIO_PATHS.character.slap.play();
        if (enemy.weakness.includes("slap")) {
            enemy.getHit();
            if (enemy.lifeCount === 0) enemy.dead = true;
        }
    }

    /**
     * Checks all collectible collisions, including coins and poison bottles.
     */
    collectibleCollision() {
        for (let collectible of this.level.collectibles) {
            this.coinCollision(collectible);
            this.poisonBottleCollison(collectible);
        }
    }

    /**
     * Handles a coin pickup interaction, including its sound and life-up rules.
     * @param {Coin} collectible The coin being checked for collision.
     */
    coinCollision(collectible) {
        if (!(collectible instanceof Coin)) return;
        if (!this.canCollectCoin(collectible)) return;
        this.removeCollectedCoin(collectible);
        this.collectCoin();
    }

    /**
     * Determines whether the given coin can currently be collected under the current life and coin rules.
     * @param {Coin} collectible The coin collectible being checked for collision.
     * @returns {boolean} True if the coin can be collected.
     */
    canCollectCoin(collectible) {
        return this.character.isColliding(collectible) && (!this.character.fullLife || this.character.coinCount < this.coinsTillLife - 1);
    }

    /**
     * Removes the collected coin from the active collectible list.
     * @param {Coin} collectible The coin collectible to remove.
     */
    removeCollectedCoin(collectible) {
        this.level.collectibles = this.level.collectibles.filter((e) => e !== collectible);
    }

    /**
     * Increases the coin counter, plays the pickup sound, and triggers a life-up when the threshold is reached.
     */
    collectCoin() {
        this.character.coinCount += 1;
        AUDIO_PATHS.collectibles.coin.currentTime = 0;
        AUDIO_PATHS.collectibles.coin.play();

        if (this.character.coinCount >= this.coinsTillLife) {
            this.applyLifeUp();
        }
    }

    /**
     * Increases the character's life count up to the maximum value and resets the coin counter.
     */
    applyLifeUp() {
        this.character.lifeCount = Math.min(this.character.lifeCount + 1, 5);
        AUDIO_PATHS.collectibles.hpUp.currentTime = 0;
        AUDIO_PATHS.collectibles.hpUp.play();
        this.character.coinCount = 0;
    }

    /**
     * Handles a poison bottle pickup and increases the poison bottle count when collection is allowed.
     * @param {PoisonBottle} collectible The poison bottle collectible being checked for collision.
     */
    poisonBottleCollison(collectible) {
        if (collectible instanceof PoisonBottle) {
            if (this.character.isColliding(collectible) && collectible.isVisible && this.character.poisonBottleCount < this.maxPoisonBottleCollected) {
                AUDIO_PATHS.collectibles.poison.play();
                collectible.deactivateForTime();
                this.character.poisonBottleCount += 1;
            }
        }
    }

    /**
     * Checks bubble-enemy collisions and delegates matching weakness handling.
     */
    bubbleCollision() {
        for (let bubble of this.bubbles) {
            for (let enemy of this.level.enemies) {
                if (bubble.isColliding(enemy) && enemy.dead == false) {
                    this.handleBubbleEnemyHit(bubble, enemy);
                    break;
                }
            }
        }
    }

    /**
     * Applies damage when the bubble type matches the enemy's weakness, then removes the bubble.
     * @param {Bubble} bubble The bubble that made contact.
     * @param {Enemy} enemy The enemy that was hit.
     */
    handleBubbleEnemyHit(bubble, enemy) {
        const weaknessMatch = (enemy.weakness.includes("bubble") && bubble.isPoisonBubble == false) || (enemy.weakness.includes("poison-bubble") && bubble.isPoisonBubble == true);
        if (weaknessMatch) {
            enemy.getHit();
            if (enemy.hasZeroLife) enemy.dead = true;
        }
        bubble.removeFromWorld();
    }

    /**
     * Spawns a bubble in the character's facing direction.
     * A poison bubble is created when the character has at least one poison bottle.
     */
    spawnBubble() {
        const range = 50;
        const y = this.character.y + 200;
        const isPoisonBubble = this.character.poisonBottleCount > 0;

        const forward = !this.character.otherDirection;
        const x = forward ? this.character.x + range + this.character.width - 50 : this.character.x - range;

        if (isPoisonBubble) {
            this.character.poisonBottleCount = Math.max(0, this.character.poisonBottleCount - 1);
        }
        this.bubbles.push(new Bubble(x, y, forward, this, isPoisonBubble));
    }

    /**
     * Detects a finished game state and shows the corresponding end-game overlay once.
     */
    checkGameEnd() {
        if (this.gameEnd) return;
        const characterDead = this.character.hasZeroLife;
        const endbossDead = this.level.endboss.deathAnimationEnd;
        if (!characterDead && !endbossDead) return;
        this.gameEnd = true;
        this.showGameEndScreen(characterDead, endbossDead);
    }

    /**
     * Stops background audio and displays the appropriate end-game overlay.
     * @param {boolean} characterDead Whether the player character died.
     * @param {boolean} endbossDead Whether the endboss died.
     */
    showGameEndScreen(characterDead, endbossDead) {
        AUDIO_PATHS.background.main.stop();
        this.uiController.gameEndContainer.classList.remove("hidden");
        if (characterDead) {
            AUDIO_PATHS.overlay.gameOver.play();
            this.uiController.gameOverImage.classList.remove("hidden");
        } else if (endbossDead) {
            AUDIO_PATHS.overlay.youWin.play();
            this.uiController.youWinImage.classList.remove("hidden");
        }
    }

    /**
     * Stops collision, rendering, character, enemy, and bubble loops.
     */
    stopAllLoops() {
        this.stopCollisionInterval();
        this.stopRenderLoop();
        this.stopCharacterLoops();
        this.stopEnemyLoops();
        this.stopBubbleLoops();
    }

    /**
     * Stops the animation-frame rendering loop.
     */
    stopRenderLoop() {
        cancelAnimationFrame(this.renderFrameId);
        this.renderFrameId = null;
    }

    /**
     * Stops the Character movement and animation loops.
     */
    stopCharacterLoops() {
        if (this.character.stopMovementInterval) {
            this.character.stopMovementInterval();
        }
        if (this.character.stopAnimationInterval) {
            this.character.stopAnimationInterval();
        }
    }

    /**
     * Stops movement and animation loops for all enemies.
     */
    stopEnemyLoops() {
        for (const enemy of this.level.enemies) {
            if (enemy.stopMovementInterval) enemy.stopMovementInterval();
            if (enemy.stopAnimationInterval) enemy.stopAnimationInterval();
        }
    }

    /**
     * Stops movement loops for all active bubbles.
     */
    stopBubbleLoops() {
        for (const bubble of this.bubbles) {
            if (bubble.stopMovementInterval) bubble.stopMovementInterval();
        }
    }
}
