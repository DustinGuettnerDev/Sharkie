/**
 * Represents the game world, managing the character, enemies, collectibles, and rendering.
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
     * Checks collisions and aggro range at regular intervals.
     * Checks are skipped while the game is paused or the character has zero life.
     */
    checkCollisionsOrAggroRange() {
        this.stopCollisionInterval();
        this.collisionInterval = setInterval(() => {
            if (this.isPaused || this.character.hasZeroLife) return;
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
     * Checks for collisions between the character and enemies, applying damage to the character or handling enemy hits if its weakness is "slap".
     */
    enemyCollision() {
        for (let enemy of this.level.enemies) {
            if (
                this.character.isColliding(enemy) &&
                !this.character.hasZeroLife &&
                !this.character.isHurt &&
                enemy.dead !== true
            ) {
                if (this.character.slap === true) {
                    this.enemySlapCollision(enemy);
                } else if (!this.testMode) {
                    this.character.getHit(enemy);
                }
            }
        }
    }

    /**
     * Handles the collision between the character's slap and the specified enemy,
     * including the slap sound effect.
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
     * Checks collisions between the character and collectible objects and delegates coin or poison handling.
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
     * Handles a poison bottle pickup interaction and updates the character's poison count when allowed.
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
     * Checks for collisions between bubbles and enemies, applying damage to enemies if the bubble's type matches their weakness.
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
     * Applies damage to the enemy if the bubble type matches its weakness, then removes the bubble.
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
     * Spawns a bubble at the character's position, moving in the direction the character is facing. If the character has poison bottles, it will spawn a poison bubble instead.
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
     * Filters collectibles so hidden poison bottles are excluded while all other collectibles remain visible.
     * @param {(Coin|PoisonBottle)[]} drawObject The array of collectible objects to filter.
     * @returns {(Coin|PoisonBottle)[]} The filtered array of collectible objects.
     */
    isVisibleFilterPB(drawObject) {
        return drawObject.filter(
            (collectible) => !(collectible instanceof PoisonBottle) || collectible.isVisible,
        );
    }

    /**
     * Adds an array of drawable objects to the map, rendering each object on the canvas.
     * @param {DrawableObject[]} drawObjects The array of drawable objects to add to the map.
     */
    addObjectsToMap(drawObjects) {
        for (let drawObject of drawObjects) {
            this.addToMap(drawObject);
        }
    }

    /**
     * Adds a single drawable object to the map, rendering it on the canvas.
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
     * Adds all HUD elements to the map, updates their current values, and renders their labels.
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
     * Draws debug frames around supported objects to visualize collision and aggro areas.
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
     * Returns whether the given object type supports debug frame rendering.
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
     * Renders a red frame around the given drawable object to visualize its collision area.
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
     * Renders the yellow aggro frame around the given drawable object to visualize its aggro area.
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
     * Flips the image of the given drawable object horizontally if it is facing the opposite direction, allowing for proper rendering of left-facing sprites.
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
     * Flips the image of the given drawable object back to its original orientation if it was previously flipped, restoring the canvas context.
     * @param {DrawableObject} drawObject The drawable object to flip back to its original orientation.
     */
    flipImageBack(drawObject) {
        if (drawObject.otherDirection) {
            drawObject.x *= -1;
            this.ctx.restore();
        }
    }

    /**
     * Detects character death or finished endboss death animation, stops background audio,
     * and shows the corresponding end-game overlay exactly once.
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
     * Stops background audio and shows the appropriate end-game overlay.
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
     * Stops all ongoing loops in the game, including collision checking, rendering, character movement and animation, and enemy movement and animation.
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
