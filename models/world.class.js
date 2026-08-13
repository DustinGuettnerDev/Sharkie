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
     * Validates required constructor dependencies before world initialization continues.
     * @param {HTMLCanvasElement} canvas Canvas element used for rendering.
     * @param {Control} control Input controller instance.
     */
    validateWorldDependencies(canvas, control) {
        if (!canvas || typeof canvas.getContext !== "function") {
            throw new Error(
                "World initialization failed: canvas is missing or does not provide getContext('2d').",
            );
        }
        if (!control) {
            throw new Error("World initialization failed: keyboard input object is required.");
        }
    }

    /**
     * Creates and validates the canvas 2D rendering context.
     * @param {HTMLCanvasElement} canvas Canvas element used for rendering.
     * @returns {CanvasRenderingContext2D} Active rendering context.
     */
    createRenderingContext(canvas) {
        const ctx = canvas.getContext("2d");
        if (!ctx) {
            throw new Error("World initialization failed: could not create 2D rendering context.");
        }
        return ctx;
    }

    /**
     * Initializes level data, character setup, and HUD state.
     * @param {Control} control Input controller instance.
     */
    initializeLevelState(control) {
        this.level = createLevel_1();
        this.control = control;
        this.character = new Character(this, this.uiController);
        this.HUD = createHud(this, this.character);
        this.setAttributes();
    }

    /**
     * Starts rendering and collision loops after successful initialization.
     */
    startWorldLoops() {
        this.render();
        this.checkCollisionsOrAggroRange();
    }

    /**
     * Sets the world reference on all enemies so they can access the game world.
     */
    setAttributes() {
        for (let enemy of this.level.regularEnemies) {
            enemy.world = this;
        }
        this.level.endboss.world = this;
    }

    /**
     * Renders the game world, including the character, enemies, collectibles, and HUD icons.
     * Rendering is skipped while the central pause flag is active.
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
     * Draws one complete world frame including map layers and HUD.
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
     * Draws all world layers that move with the camera offset.
     */
    drawScrollableWorldLayers() {
        this.addObjectsToMap(this.level.backgroundObjects);
        this.addObjectsToMap(this.isVisibleFilterPB(this.level.collectibles));
        this.addObjectsToMap(this.bubbles);
        this.addObjectsToMap(this.level.enemies);
        this.addToMap(this.character);
    }

    /**
     * Checks enemy, collectible, and bubble collisions at regular intervals.
     * All collision checks are skipped while the game is paused, ended, or the character has no life left.
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
     * Stops the collision checking interval if it is currently running.
     */
    stopCollisionInterval() {
        if (this.collisionInterval) {
            clearInterval(this.collisionInterval);
            this.collisionInterval = null;
        }
    }

    /**
     * Resolves character-enemy collisions. During the slap hit window, the enemy is attacked;
     * otherwise the character takes damage unless test mode or the slap action is active.
     */
    enemyCollision() {
        for (let enemy of this.level.enemies) {
            if (
                this.character.isColliding(enemy) &&
                !this.character.hasZeroLife &&
                !this.character.isHurt &&
                enemy.dead !== true
            ) {
                if (this.character.slapHitWindow === true) {
                    this.enemySlapCollision(enemy);
                } else if (!this.testMode && !this.character.slap) {
                    this.character.getHit(enemy);
                }
            }
        }
    }

    /**
     * Handles an enemy hit during the character's active slap hit window.
     * The enemy only takes damage when its weakness includes "slap".
     * @param {Enemy} enemy The enemy object being slapped.
     */
    enemySlapCollision(enemy) {
        AUDIO_PATHS.character.slap.play();
        if (enemy.weakness.includes("slap")) {
            enemy.getHit();
            if (enemy.lifeCount === 0) {
                enemy.dead = true;
            }
        }
    }

    /**
     * Checks collisions between the character and all collectibles.
     * Coin and poison bottle handling is delegated to their respective methods.
     */
    collectibleCollision() {
        for (let collectible of this.level.collectibles) {
            this.coinCollision(collectible);
            this.poisonBottleCollison(collectible);
        }
    }

    /**
     * Handles a coin pickup interaction, including collection rules, sounds, and life-up progression.
     * @param {Coin} collectible The coin collectible being checked for collision.
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
        return (
            this.character.isColliding(collectible) &&
            (!this.character.fullLife || this.character.coinCount < this.coinsTillLife - 1)
        );
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
            if (
                this.character.isColliding(collectible) &&
                collectible.isVisible &&
                this.character.poisonBottleCount < this.maxPoisonBottleCollected
            ) {
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
        const weaknessMatch =
            (enemy.weakness.includes("bubble") && bubble.isPoisonBubble == false) ||
            (enemy.weakness.includes("poison-bubble") && bubble.isPoisonBubble == true);
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
        const x = forward
            ? this.character.x + range + this.character.width - 50
            : this.character.x - range;

        if (isPoisonBubble) {
            this.character.poisonBottleCount = Math.max(0, this.character.poisonBottleCount - 1);
        }
        this.bubbles.push(new Bubble(x, y, forward, this, isPoisonBubble));
    }

    /**
     * Excludes hidden poison bottles from rendering while keeping all other collectibles.
     * @param {(Coin|PoisonBottle)[]} drawObject The array of collectible objects to filter.
     * @returns {(Coin|PoisonBottle)[]} The filtered array of collectible objects.
     */
    isVisibleFilterPB(drawObject) {
        return drawObject.filter(
            (collectible) => !(collectible instanceof PoisonBottle) || collectible.isVisible,
        );
    }

    /**
     * Renders every object in the supplied collection.
     * @param {DrawableObject[]} drawObjects The array of drawable objects to add to the map.
     */
    addObjectsToMap(drawObjects) {
        for (let drawObject of drawObjects) {
            this.addToMap(drawObject);
        }
    }

    /**
     * Renders one object and, when test mode is enabled, its debug frames.
     * @param {DrawableObject} drawObject The drawable object to add to the map.
     */
    addToMap(drawObject) {
        this.flipImage(drawObject);

        this.draw(drawObject);
        if (this.testMode) {
            this.drawFrame(drawObject);
        }

        this.flipImageBack(drawObject);
    }

    /**
     * Renders all HUD elements, updates their values, and draws icon counters.
     */
    addHudToMap() {
        for (let hudElement of this.HUD) {
            this.addToMap(hudElement);
            hudElement.update();
            if (hudElement.mode === "icon") {
                this.drawValue({
                    text: hudElement.iconValue,
                    x: hudElement.x + hudElement.fontOffsetX,
                    y: hudElement.y + hudElement.fontOffsetY,
                });
            }
        }
    }

    /**
     * Draws a drawable object on the canvas.
     * @param {DrawableObject} drawObject The drawable object to draw.
     */
    draw(drawObject) {
        if (drawObject.img) {
            this.ctx.drawImage(
                drawObject.img,
                drawObject.x,
                drawObject.y,
                drawObject.width,
                drawObject.height,
            );
        }
    }

    /**
     * Draws a value (text or number) on the canvas at the specified position with optional font and fill style.
     * @param {{ text: string|number, x: number, y: number, font?: string, fillStyle?: string }} param0 The parameters for drawing the value.
     */
    drawValue({ text, x, y, font = "24px Arial", fillStyle = "white" }) {
        this.ctx.font = font;
        this.ctx.fillStyle = fillStyle;
        this.ctx.fillText(`x ${text}`, x, y);
    }

    /**
     * Draws the red collision frame and, when available, the yellow aggro frame.
     * @param {DrawableObject} drawObject The drawable object for which to draw the collision frame.
     */
    drawFrame(drawObject) {
        if (!this.isDebugFrameSupported(drawObject)) return;
        this.renderingRedCollisonFrame(drawObject);
        if (drawObject.aggroOffset) {
            this.renderingYellowAggroFrame(drawObject);
        }
    }

    /**
     * Returns whether the object supports collision-frame rendering.
     * @param {DrawableObject} drawObject The object to check.
     * @returns {boolean} True if a debug frame should be drawn for this object.
     */
    isDebugFrameSupported(drawObject) {
        return (
            drawObject instanceof Character ||
            drawObject instanceof Puffer ||
            drawObject instanceof JellyFish ||
            drawObject instanceof Endboss ||
            drawObject instanceof Coin ||
            drawObject instanceof Bubble ||
            drawObject instanceof PoisonBottle
        );
    }

    /**
     * Renders a red frame around the object's collision area.
     * @param {DrawableObject} drawObject The drawable object for which to draw the red collision frame.
     */
    renderingRedCollisonFrame(drawObject) {
        this.ctx.beginPath();
        this.ctx.lineWidth = "5";
        this.ctx.strokeStyle = "red";
        this.ctx.rect(
            drawObject.x + drawObject.collisionOffset.left,
            drawObject.y + drawObject.collisionOffset.top,
            drawObject.width - drawObject.collisionOffset.left - drawObject.collisionOffset.right,
            drawObject.height - drawObject.collisionOffset.top - drawObject.collisionOffset.bottom,
        );
        this.ctx.stroke();
    }

    /**
     * Renders a yellow frame around the object's aggro area.
     * @param {DrawableObject} drawObject The drawable object for which to draw the yellow aggro frame.
     */
    renderingYellowAggroFrame(drawObject) {
        this.ctx.beginPath();
        this.ctx.lineWidth = "5";
        this.ctx.strokeStyle = "yellow";
        this.ctx.rect(
            drawObject.x + drawObject.aggroOffset.left,
            drawObject.y + drawObject.aggroOffset.top,
            drawObject.width - drawObject.aggroOffset.left - drawObject.aggroOffset.right,
            drawObject.height - drawObject.aggroOffset.top - drawObject.aggroOffset.bottom,
        );
        this.ctx.stroke();
    }

    /**
     * Temporarily flips the canvas and object position for left-facing sprites.
     * @param {DrawableObject} drawObject The drawable object to flip.
     */
    flipImage(drawObject) {
        if (drawObject.otherDirection) {
            this.ctx.save();
            this.ctx.translate(drawObject.width, 0);
            this.ctx.scale(-1, 1);
            drawObject.x *= -1;
        }
    }

    /**
     * Restores the canvas and object position after a temporary horizontal flip.
     * @param {DrawableObject} drawObject The drawable object to flip back to its original orientation.
     */
    flipImageBack(drawObject) {
        if (drawObject.otherDirection) {
            drawObject.x *= -1;
            this.ctx.restore();
        }
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
     * Stops collision checking, rendering, character loops, enemy loops, and bubble loops.
     */
    stopAllLoops() {
        this.stopCollisionInterval();
        this.stopRenderLoop();
        this.stopCharacterLoops();
        this.stopEnemyLoops();
        this.stopBubbleLoops();
    }

    /**
     * Stops the animation frame render loop and clears its id.
     */
    stopRenderLoop() {
        cancelAnimationFrame(this.renderFrameId);
        this.renderFrameId = null;
    }

    /**
     * Stops character movement and animation intervals when available.
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
     * Stops movement and animation intervals for all active enemies.
     */
    stopEnemyLoops() {
        for (const enemy of this.level.enemies) {
            if (enemy.stopMovementInterval) enemy.stopMovementInterval();
            if (enemy.stopAnimationInterval) enemy.stopAnimationInterval();
        }
    }

    /**
     * Stops movement intervals for all active bubbles.
     */
    stopBubbleLoops() {
        for (const bubble of this.bubbles) {
            if (bubble.stopMovementInterval) bubble.stopMovementInterval();
        }
    }
}
