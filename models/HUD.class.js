class HudIcon extends DrawableObject {
    path;
    x;
    y;
    height;
    width;
    iconValue;
    fontOffsetY;
    world;
    kind;

    constructor({ path, x, y, height = 70, width = 70, fontOffsetY = 0, iconValue = 0, kind }) {
        super();

        this.path = path;
        this.x = x;
        this.y = y;
        this.height = height;
        this.width = width;
        this.iconValue = iconValue;
        this.loadImage(this.path);
        this.fontOffsetY = fontOffsetY;
        this.kind = kind;
    }

    updateValue() {
        if (this.kind === "life") this.iconValue = this.world.character.life;
        if (this.kind === "coins") this.iconValue = this.world.character.coins;
        if (this.kind === "poison") this.iconValue = this.world.character.poison;
    }
}
