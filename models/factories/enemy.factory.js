/**
 * Creates the regular enemy setup for level 1.
 * @returns {(Puffer|JellyFish)[]} The generated enemy list.
 */
function createLevel1Enemies() {
    return createEnemies([Puffer, JellyFish], 30, 500, 9000);
}

/**
 * Creates the level 1 end boss with configurable positioning values.
 * @param {number} [xPosition=7400] X-position of the end boss.
 * @param {number} [triggerPosition=6800] Trigger position where the boss appears.
 * @returns {Endboss} The generated end boss object.
 */
function createLevel1Endboss(xPosition = 7400, triggerPosition = 6800) {
    return new Endboss({
        x: xPosition,
        appearingPositionTrigger: triggerPosition,
    });
}

/**
 * Creates a random set of regular enemies with evenly spaced spawn positions.
 * @param {Array<Function>} enemySpecies List of enemy classes that can be spawned.
 * @param {number} enemyNumber Number of enemies to create.
 * @param {number} levelStartSpawnRegularEnemies First spawn position.
 * @param {number} levelEndingRegularEnemies Last spawn position.
 * @returns {(Puffer|JellyFish)[]} The generated enemy list.
 */
function createEnemies(
    enemySpecies,
    enemyNumber,
    levelStartSpawnRegularEnemies,
    levelEndingRegularEnemies,
) {
    const enemyArray = [];
    const positionPerEnemy = levelEndingRegularEnemies / enemyNumber;
    let positionOffset = levelStartSpawnRegularEnemies;

    for (let index = 0; index < enemyNumber; index++) {
        const randomBit = Math.round(Math.random());
        const SpeciesClass = enemySpecies[randomBit];

        enemyArray.push(new SpeciesClass(positionOffset));
        positionOffset += positionPerEnemy;
    }

    return enemyArray;
}
