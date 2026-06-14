class HudIcon extends DrawableObject {
    path;
    x;
    y;
    height;
    width;
    iconValue;
    world;

    constructor(path, x, y, iconValue, height = 70, width = 70) {
        super();

        this.path = path;
        this.x = x;
        this.y = y;
        this.height = height;
        this.width = width;
        this.iconValue = iconValue;
        this.loadImage(this.path);
    }
    // einfügen in loop
    drawHudIconValue() {
        this.world.ctx.font = "24px Arial";
        this.world.ctx.fillStyle = "black";
        this.world.ctx.fillText(`${this.iconValue}`, this.x + 70, this.y + 45);
    }
}
