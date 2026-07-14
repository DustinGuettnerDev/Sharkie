/**
 * Represents a level in the game, containing enemies, collectibles, background objects, and level boundaries.
 */
class Level {
    regularEnemies = [];
    endboss = null;
    collectible = [];
    backgroundObjects = [];
    levelStart_x = -1;
    levelEnd_x = 4000;

    constructor(
        regularEnemies = [],
        endboss = null,
        collectible = [],
        backgroundObjects = [],
        levelStart_x = -1,
        levelEnd_x = 4000,
    ) {
        this.regularEnemies = regularEnemies;
        this.endboss = endboss;
        this.collectible = collectible;
        this.backgroundObjects = backgroundObjects;
        this.levelStart_x = levelStart_x;
        this.levelEnd_x = levelEnd_x;
    }

    get enemies() {
        return [...this.regularEnemies, this.endboss];
    }

    createLevel(level) {
        if (level instanceof Level) {
            return level;
        }
        return null;
    }
}
