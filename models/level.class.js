class Level {
    enemies;
    collectible;
    backgroundObjects;
    levelEnd_x = 1440;

    constructor(enemies, collectible, backgroundObjects) {
        this.enemies = enemies;
        this.collectible = collectible;
        this.backgroundObjects = backgroundObjects;
    }
}
