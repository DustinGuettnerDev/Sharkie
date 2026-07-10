class OverlayObjects extends DrawableObject {
    type;

    constructor({
        imgPath,
        x = 0,
        y = 0,
        width = 100,
        height = 100,
        type = "startButton",
        isVisible = true,
    }) {
        super();
        this.loadImage(imgPath);
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.type = type;
        this.isVisible = isVisible;
        /* this.startTypeLogic(); */
    }

    /*     startTypeLogic() {
        const type = this.type;
        if (type === "startButton") {
            this.#startLogic();
        } else if (type === "restartButton") {
            this.#restartLogic();
        }
    }

    #startLogic() {}

    #restartLogic() {}
 */
    // einen listener für alle erstellen damit man nicht zig verschiedenen hat
    // code muss hier überarbietet werden
}
