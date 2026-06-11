class Level {
    enemies;
    backgroundObjects;
    levelEnd_x = 1440;

    constructor(enemies, backgroundObjects, levelEndX) {
        this.enemies = enemies;
        this.backgroundObjects = backgroundObjects;
    }
}
