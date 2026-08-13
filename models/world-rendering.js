/**
 * Extends World with rendering, HUD, and debug-frame helpers.
 * This file must load after world.class.js and before World is instantiated.
 */
World.prototype.isVisibleFilterPB = function (drawObjects) {
    return drawObjects.filter((collectible) => !(collectible instanceof PoisonBottle) || collectible.isVisible);
};

/**
 * Renders every object in the supplied collection.
 * @param {DrawableObject[]} drawObjects Objects to render.
 */
World.prototype.addObjectsToMap = function (drawObjects) {
    for (let drawObject of drawObjects) {
        this.addToMap(drawObject);
    }
};

/**
 * Renders one object and its optional debug frame.
 * @param {DrawableObject} drawObject Object to render.
 */
World.prototype.addToMap = function (drawObject) {
    this.flipImage(drawObject);
    this.draw(drawObject);
    if (this.testMode) this.drawFrame(drawObject);
    this.flipImageBack(drawObject);
};

/**
 * Renders HUD elements and their values.
 */
World.prototype.addHudToMap = function () {
    for (let hudElement of this.HUD) {
        this.addToMap(hudElement);
        hudElement.update();
        if (hudElement.mode === "icon") this.drawHudValue(hudElement);
    }
};

/**
 * Draws an icon value belonging to a HUD element.
 * @param {HUD} hudElement HUD element whose value is drawn.
 */
World.prototype.drawHudValue = function (hudElement) {
    this.drawValue({
        text: hudElement.iconValue,
        x: hudElement.x + hudElement.fontOffsetX,
        y: hudElement.y + hudElement.fontOffsetY,
    });
};

/**
 * Draws a drawable object on the canvas.
 * @param {DrawableObject} drawObject Object to draw.
 */
World.prototype.draw = function (drawObject) {
    if (drawObject.img) {
        this.ctx.drawImage(drawObject.img, drawObject.x, drawObject.y, drawObject.width, drawObject.height);
    }
};

/**
 * Draws a value on the canvas.
 * @param {{text: string|number, x: number, y: number, font?: string, fillStyle?: string}} value Value to draw.
 */
World.prototype.drawValue = function ({ text, x, y, font = "24px Arial", fillStyle = "white" }) {
    this.ctx.font = font;
    this.ctx.fillStyle = fillStyle;
    this.ctx.fillText(`x ${text}`, x, y);
};

/**
 * Draws supported collision and aggro debug frames.
 * @param {DrawableObject} drawObject Object whose frames are drawn.
 */
World.prototype.drawFrame = function (drawObject) {
    if (!this.isDebugFrameSupported(drawObject)) return;
    this.renderingRedCollisonFrame(drawObject);
    if (drawObject.aggroOffset) this.renderingYellowAggroFrame(drawObject);
};

/**
 * Checks whether an object supports debug-frame rendering.
 * @param {DrawableObject} drawObject Object to check.
 * @returns {boolean} True when debug frames are supported.
 */
World.prototype.isDebugFrameSupported = function (drawObject) {
    return drawObject instanceof Character || drawObject instanceof Puffer || drawObject instanceof JellyFish || drawObject instanceof Endboss || drawObject instanceof Coin || drawObject instanceof Bubble || drawObject instanceof PoisonBottle;
};

/**
 * Renders the collision frame of an object.
 * @param {DrawableObject} drawObject Object whose collision frame is drawn.
 */
World.prototype.renderingRedCollisonFrame = function (drawObject) {
    this.ctx.beginPath();
    this.ctx.lineWidth = "5";
    this.ctx.strokeStyle = "red";
    this.ctx.rect(drawObject.x + drawObject.collisionOffset.left, drawObject.y + drawObject.collisionOffset.top, drawObject.width - drawObject.collisionOffset.left - drawObject.collisionOffset.right, drawObject.height - drawObject.collisionOffset.top - drawObject.collisionOffset.bottom);
    this.ctx.stroke();
};

/**
 * Renders the aggro frame of an object.
 * @param {DrawableObject} drawObject Object whose aggro frame is drawn.
 */
World.prototype.renderingYellowAggroFrame = function (drawObject) {
    this.ctx.beginPath();
    this.ctx.lineWidth = "5";
    this.ctx.strokeStyle = "yellow";
    this.ctx.rect(drawObject.x + drawObject.aggroOffset.left, drawObject.y + drawObject.aggroOffset.top, drawObject.width - drawObject.aggroOffset.left - drawObject.aggroOffset.right, drawObject.height - drawObject.aggroOffset.top - drawObject.aggroOffset.bottom);
    this.ctx.stroke();
};

/**
 * Flips an object before drawing when it faces left.
 * @param {DrawableObject} drawObject Object to flip.
 */
World.prototype.flipImage = function (drawObject) {
    if (drawObject.otherDirection) {
        this.ctx.save();
        this.ctx.translate(drawObject.width, 0);
        this.ctx.scale(-1, 1);
        drawObject.x *= -1;
    }
};

/**
 * Restores an object's position and canvas state after drawing.
 * @param {DrawableObject} drawObject Object to restore.
 */
World.prototype.flipImageBack = function (drawObject) {
    if (drawObject.otherDirection) {
        drawObject.x *= -1;
        this.ctx.restore();
    }
};
