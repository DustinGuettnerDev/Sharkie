/**
 * Represents the game world, managing the character, enemies, collectibles, and rendering.
 */
class World {
    character = null;
    hudIcons = [];
    level = level_1;
    ctx = null;
    canvas = null;
    keyboard = null;
    collisionInterval = null;
    renderFrameId = null;
    camera_x = 0;
    bubbles = [];
    invincibleMode = true;
    coinsTillLife = 7;
    maxPoisonBottleCollected = 2;
    gameEnd = false;

    constructor(canvas, keyboard) {
        if (!canvas || typeof canvas.getContext !== "function") {
            throw new Error(
                "World initialization failed: canvas is missing or does not provide getContext('2d').",
            );
        }
        if (!keyboard) {
            throw new Error("World initialization failed: keyboard input object is required.");
        }

        this.canvas = canvas;
        this.ctx = canvas.getContext("2d"); // 2d zeichenkontext wird in ctx gespeichert
        if (!this.ctx) {
            throw new Error("World initialization failed: could not create 2D rendering context.");
        }
        this.keyboard = keyboard;
        this.character = new Character(this);
        this.hudIcons = createHudIcons(this, this.character);
        this.setWorld();
        this.render();
        this.checkCollisionsOrAggroRange();
    }

    /**
     * Renders the game world, including the character, enemies, collectibles, and HUD icons.
     */
    render() {
        if (this.gameEnd) return;
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Shift the entire canvas context to the left by camera_x pixels to simulate camera movement
        this.ctx.translate(this.camera_x, 0);

        // Renders the background objects, collectibles, bubbles, enemies, and character in the correct order on the shifted canvas context.
        this.addObjectsToMap(this.level.backgroundObjects);
        this.addObjectsToMap(this.isVisibleFilterPB(this.level.collectible));
        this.addObjectsToMap(this.bubbles);
        this.addObjectsToMap(this.level.enemies);
        this.addToMap(this.character);

        // Reset the translation for the next frame
        // If not it would accumulate and the world would move faster and faster to the left.
        // translate(-100) = moves the camera -100 to the left; the next time translate(-100) would move it -200 to the left, and so on.
        this.ctx.translate(-this.camera_x, 0);

        // Renders the HUD icons on the canvas without any translation, keeping them fixed on the screen.
        this.addHudIconsToMap();
        this.renderFrameId = requestAnimationFrame(() => {
            this.render();
        });
    }

    /**
     * Checks for collisions and aggro range between the character, enemies, collectibles, and bubbles at regular intervals.
     */
    checkCollisionsOrAggroRange() {
        this.stopCollisionInterval();
        this.collisionInterval = setInterval(() => {
            this.checkGameEnd();
            if (this.gameEnd) return;
            this.enemyCollision();
            this.collectibleCollision();
            this.bubbleCollision();
        }, 400);
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
                !this.character.hasZeroLife() &&
                !this.character.isHurt() &&
                enemy.death !== true
            ) {
                if (this.character.slap === true) {
                    this.enemySlapCollision(enemy);
                } else if (!this.invincibleMode) {
                    this.character.getHit(enemy);
                }
            }
        }
    }

    /**
     * Handles the collision between the character's slap and the specified enemy.
     * @param {Enemy} enemy The enemy object being slapped.
     */
    enemySlapCollision(enemy) {
        if (enemy.weakness.includes("slap")) {
            enemy.getHit();
            if (enemy.lifeCount === 0) {
                enemy.death = true;
            }
        }
    }

    /**
     * Checks for collisions between the character and collectibles, handling coin collection and poison bottle collection.
     */
    collectibleCollision() {
        for (let collectible of this.level.collectible) {
            this.coinCollision(collectible);
            this.poisonBottleCollison(collectible);
        }
    }

    /**
     * Handles the collision between the character and a coin collectible.
     * @param {Coin} collectible The coin collectible being checked for collision.
     */
    coinCollision(collectible) {
        if (collectible instanceof Coin) {
            if (this.character.isColliding(collectible)) {
                this.level.collectible = this.level.collectible.filter((e) => e !== collectible);
                this.character.coinCount += 1;
                if (this.character.coinCount >= this.coinsTillLife) {
                    this.character.lifeCount += 1;
                    this.character.coinCount = 0;
                }
            }
        }
    }

    /**
     * Handles the collision between the character and a poison bottle collectible.
     * @param {PoisonBottle} collectible The poison bottle collectible being checked for collision.
     */
    poisonBottleCollison(collectible) {
        if (collectible instanceof PoisonBottle) {
            if (
                this.character.isColliding(collectible) &&
                collectible.isVisible &&
                this.character.poisonBottleCount < this.maxPoisonBottleCollected
            ) {
                collectible.deactivateForTime();
                this.character.poisonBottleCount += 1;
            }
        }
    }

    /**
     * Checks for collisions between bubbles and enemies, applying damage to enemies if the bubble's type matches their weakness.
     */
    bubbleCollision() {
        for (let bubble of this.bubbles)
            for (let enemy of this.level.enemies) {
                if (bubble.isColliding(enemy) && enemy.death == false) {
                    if (
                        (enemy.weakness.includes("bubble") && bubble.isPoisonBubble == false) ||
                        (enemy.weakness.includes("poison-bubble") && bubble.isPoisonBubble == true)
                    ) {
                        enemy.getHit();
                        if (enemy.hasZeroLife()) {
                            enemy.death = true;
                        }
                    }
                    bubble.removeFromWorld();
                    break;
                }
            }
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
     * Sets the world reference for all enemies in the level, allowing them to access the world context.
     */
    setWorld() {
        for (let enemy of this.level.regularEnemies) {
            if (enemy instanceof Puffer) {
                enemy.world = this;
            }
        }
        this.level.endboss.world = this;
    }

    /**
     * Checks if the PoisonBottle collectibles are visible, filtering out any that are not currently visible.
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
        this.drawFrame(drawObject);

        this.flipImageBack(drawObject);
    }

    /**
     * Adds HUD icons to the map, updating their values and rendering them on the canvas.
     */
    addHudIconsToMap() {
        for (let icon of this.hudIcons) {
            this.addToMap(icon);
            icon.updateValue();
            this.drawValue({
                text: icon.iconValue,
                x: icon.x + 70,
                y: icon.y + 50 + icon.fontOffsetY,
            });
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
     * draws a red and yellow frame around the given drawable object to visualize its collision and aggro areas.
     * @param {DrawableObject} drawObject The drawable object for which to draw the collision frame.
     */
    drawFrame(drawObject) {
        if (
            drawObject instanceof Character ||
            drawObject instanceof Puffer ||
            drawObject instanceof JellyFish ||
            drawObject instanceof Endboss ||
            drawObject instanceof Coin ||
            drawObject instanceof Bubble ||
            drawObject instanceof PoisonBottle
        ) {
            this.renderingRedCollisonFrame(drawObject);

            if (drawObject.aggroOffset) {
                this.renderingYellowAggroFrame(drawObject);
            }
        }
    }

    /**
     * Rendering a red frame around the given drawable object to visualize its collision area.
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
     * Rendering the yellow aggro frame around the given drawable object to visualize its aggro area.
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
     * Checks if the game has ended based on the character's life and the endboss's death animation, stopping all loops if the game has ended.
     */
    checkGameEnd() {
        const characterDeadAnimationEnd =
            this.character.hasZeroLife() &&
            (this.character.deathRiseUpEnded || this.character.deathFallDownEnded);

        const endboss = this.level.endboss;
        const endbossDeathAnimationEnd = endboss ? endboss.deathRiseUpEnded : false;
        this.gameEnd = characterDeadAnimationEnd || endbossDeathAnimationEnd;

        if (this.gameEnd) {
            this.stopAllLoops();
        }
    }

    /**
     * Stops all ongoing loops in the game, including collision checking, rendering, character movement and animation, and enemy movement and animation.
     */
    stopAllLoops() {
        this.stopCollisionInterval();

        /* if (this.renderFrameId) {
            cancelAnimationFrame(this.renderFrameId);
            this.renderFrameId = null;
        } */

        if (this.character.stopMovementInterval) {
            this.character.stopMovementInterval();
        }
        if (this.character.stopAnimationInterval) {
            this.character.stopAnimationInterval();
        }

        for (const enemy of this.level.enemies) {
            if (enemy.stopMovementInterval) {
                enemy.stopMovementInterval();
            }
            if (enemy.stopAnimationInterval) {
                enemy.stopAnimationInterval();
            }
        }

        for (const bubble of this.bubbles) {
            if (bubble.stopMovementInterval) {
                bubble.stopMovementInterval();
            }
        }
    }
}
