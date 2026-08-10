/**
 * Creates the first level by composing enemies, collectibles, backgrounds, and the end boss.
 * @returns {Level} The generated level object.
 */
function createLevel_1() {
    return new Level({
        regularEnemies: createLevel1Enemies(),
        endboss: createLevel1Endboss(),
        collectibles: createLevel1Collectibles(),
        backgroundObjects: createLevel1Background(),
        levelStart_x: -1,
        levelEnd_x: 8000,
    });
}
