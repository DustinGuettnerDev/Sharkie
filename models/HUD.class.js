/**
 * Represents a HUD (Heads-Up Display) icon in the game, extending the DrawableObject class.
 */
class Hud extends DrawableObject {
    iconValue = null;

    /**
     * Creates a HUD element with image, position, and value tracking.
     * @param {Object} config Configuration object for the HUD element.
     */
    constructor({
        mode = "icon",
        iconPath = null,
        barArrayPaths = null,
        x = 0,
        y = 0,
        height = 70,
        width = 70,
        fontOffsetY = 0,
        fontOffsetX = 0,
        kind = null,
        world = null,
    } = {}) {
        super();
        this.mode = mode;
        this.iconPath = iconPath;
        this.barArrayPaths = barArrayPaths;
        this.x = x;
        this.y = y;
        this.height = height;
        this.width = width;
        this.fontOffsetY = fontOffsetY;
        this.fontOffsetX = fontOffsetX;
        this.kind = kind;
        this.world = world;
        this.initializeMode();
        this.update();
    }

    /**
     * Updates the HUD element depending on whether it is rendered as a bar or an icon.
     */
    update() {
        if (this.mode === "bar") {
            this.updateBar();
        } else {
            this.updateIconValue();
        }
    }

    /**
     * Updates the life bar HUD element based on the current life count.
     */
    updateBar() {
        if (this.kind === "life") {
            const barPercent = (100 / 5) * this.world.character.lifeCount;
            this.loadImage(`assets/img/ui/life/${barPercent}.png`);
        }
    }

    /**
     * Updates the displayed value for icon-based HUD elements.
     */
    updateIconValue() {
        if (this.kind === "coins") this.iconValue = this.world.character.coinCount;
        if (this.kind === "poison") this.iconValue = this.world.character.poisonBottleCount;
    }

    /**
     * Initializes the HUD element according to its configured mode.
     */
    initializeMode() {
        if (this.mode === "bar") {
            this.configureBar();
        } else {
            this.configureIcon();
        }
    }

    /**
     * Configures the HUD element as a bar by loading all bar images.
     */
    configureBar() {
        if (this.barArrayPaths) {
            this.loadImages(this.barArrayPaths);
        } else {
            throw Error("No bar paths available");
        }
    }

    /**
     * Configures the HUD element as an icon by loading the single icon image.
     */
    configureIcon() {
        if (this.iconPath) {
            this.loadImage(this.iconPath);
        } else {
            throw Error("No icon path available");
        }
    }
}
