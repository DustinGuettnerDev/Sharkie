/**
 * Represents a HUD (Heads-Up Display) icon in the game, extending the DrawableObject class.
 */
class HudIcon extends DrawableObject {
    constructor({
        path = "",
        x = 0,
        y = 0,
        height = 70,
        width = 70,
        fontOffsetY = 0,
        iconValue = 0,
        kind = "",
        world = null,
    } = {}) {
        super();

        this.path = path;
        this.x = x;
        this.y = y;
        this.height = height;
        this.width = width;
        this.iconValue = iconValue;
        if (this.path) this.loadImage(this.path);
        this.fontOffsetY = fontOffsetY;
        this.kind = kind;
        this.world = world;
    }

    /**
     * Updates the icon value based on the current state of the world and character.
     */
    updateValue() {
        if (!this.world?.character) return;
        if (this.kind === "life") this.iconValue = this.world.character.lifeCount;
        if (this.kind === "coins") this.iconValue = this.world.character.coinCount;
        if (this.kind === "poison") this.iconValue = this.world.character.poisonBottleCount;
    }
}
