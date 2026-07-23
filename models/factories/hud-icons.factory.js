/**
 * Creates the HUD icons for life, poison bottles, and coins using current player values.
 * @param {World} world Current game world passed to each icon.
 * @param {Character} character Player character containing the current counters.
 * @returns {HudIcon[]} List of all initialized HUD icons.
 */
function createHudIcons(world, character) {
    return [
        new HudIcon({
            path: IMG_PATHS.hudIcons.life,
            x: 150,
            y: 30,
            iconValue: character.lifeCount,
            kind: "life",
            world,
        }),

        new HudIcon({
            path: IMG_PATHS.hudIcons.poison,
            x: 30,
            y: 20,
            height: 80,
            width: 80,
            fontOffsetY: 10,
            iconValue: character.poisonBottleCount,
            kind: "poison",
            world,
        }),

        new HudIcon({
            path: IMG_PATHS.hudIcons.coin,
            x: 270,
            y: 35,
            fontOffsetY: -5,
            iconValue: character.coinCount,
            kind: "coins",
            world,
        }),
    ];
}
