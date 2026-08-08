/**
 * Creates the HUD elements for life, poison bottles, and coins using the current player values.
 * @param {World} world Current game world passed to each HUD element.
 * @param {Character} character Player character containing the current counters.
 * @returns {HUD[]} List of all initialized HUD elements.
 */
function createHud(world, character) {
    return [
        createHudLifeBar(world, character),
        createPoisonHudIcon(world, character),
        createCoinHudIcon(world, character),
    ];
}

/**
 * Creates the life HUD element with the current life counter.
 * @param {World} world Current game world.
 * @param {Character} character Player character.
 * @returns {HUD} Life HUD element.
 */
function createHudLifeBar(world, character) {
    return new Hud({
        mode: "bar",
        barArrayPaths: IMG_PATHS.hud.lifebar,
        x: 50,
        y: 25,
        width: 180,
        height: 60,
        kind: "life",
        world,
    });
}

/**
 * Creates the poison HUD element with the current bottle count and custom sizing.
 * @param {World} world Current game world.
 * @param {Character} character Player character.
 * @returns {HUD} Poison HUD element.
 */
function createPoisonHudIcon(world, character) {
    return new Hud({
        mode: "icon",
        iconPath: IMG_PATHS.hud.poison,
        x: 350,
        y: 5,
        height: 90,
        width: 90,
        fontOffsetY: 70,
        fontOffsetX: 80,
        kind: "poison",
        world,
    });
}

/**
 * Creates the coin HUD element with the current coin counter.
 * @param {World} world Current game world.
 * @param {Character} character Player character.
 * @returns {HUD} Coin HUD element.
 */
function createCoinHudIcon(world, character) {
    return new Hud({
        mode: "icon",
        iconPath: IMG_PATHS.hud.coin,
        x: 250,
        y: 35,
        height: 60,
        width: 60,
        fontOffsetY: 40,
        fontOffsetX: 70,
        kind: "coins",
        world,
    });
}
