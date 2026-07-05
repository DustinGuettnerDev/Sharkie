class Level {
    enemies;
    collectible;
    backgroundObjects;
    levelStart_x;
    levelEnd_x;

    constructor(enemies, collectible, backgroundObjects, levelStart_x = -1, levelEnd_x = 4000) {
        this.enemies = enemies;
        this.collectible = collectible;
        this.backgroundObjects = backgroundObjects;
        this.levelStart_x = levelStart_x;
        this.levelEnd_x = levelEnd_x;
    }
}
