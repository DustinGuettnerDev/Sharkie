/**
 * Represents a level in the game, containing enemies, collectibles, background objects, and level boundaries.
 */
class Level {
    regularEnemies;
    endboss;
    collectibles;
    backgroundObjects;
    levelStart_x;
    levelEnd_x;

    /**
     * @param {(Puffer|JellyFish)[]} regularEnemies Regular enemies in the level.
     * @param {Endboss} endboss Endboss instance.
     * @param {(Coin|PoisonBottle)[]} collectibles Collectible objects.
     * @param {BackgroundObject[]} backgroundObjects Background layer objects.
     * @param {number} levelStart_x Left boundary x position.
     * @param {number} levelEnd_x Right boundary x position.
     */
    constructor({ regularEnemies = [], endboss = null, collectibles = [], backgroundObjects = [], levelStart_x = -1, levelEnd_x = 4000 } = {}) {
        this.regularEnemies = regularEnemies;
        this.endboss = endboss;
        this.collectibles = collectibles;
        this.backgroundObjects = backgroundObjects;
        this.levelStart_x = levelStart_x;
        this.levelEnd_x = levelEnd_x;
    }

    /**
     * Returns all enemies combined into one array for collision and rendering.
     * @returns {(Puffer|JellyFish|Endboss)[]} All enemies in this level.
     */
    get enemies() {
        return [...this.regularEnemies, this.endboss];
    }
}
