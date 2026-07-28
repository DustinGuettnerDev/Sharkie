/**
 * Manages all input controls for the game character,
 * including keyboard and mobile touch button events.
 */
class Control {
    right = false;
    left = false;
    up = false;
    down = false;
    spacebar = false;
    d = false;

    constructor() {
        this.initKeyboard();
        this.initMobileKeys();
    }

    /**
     * Registers keydown and keyup event listeners for keyboard controls.
     */
    initKeyboard() {
        document.addEventListener("keydown", (e) => {
            if (e.code === "ArrowRight") {
                this.moveRight(true);
            }
            if (e.code === "ArrowLeft") {
                this.moveLeft(true);
            }
            if (e.code === "ArrowUp") {
                this.moveUp(true);
            }
            if (e.code === "ArrowDown") {
                this.moveDown(true);
            }
            if (e.code === "Space") {
                this.pressSpacebar(true);
            }
            if (e.code === "KeyD") {
                this.pressD(true);
            }
        });

        document.addEventListener("keyup", (e) => {
            if (e.code === "ArrowRight") {
                this.moveRight(false);
            }
            if (e.code === "ArrowLeft") {
                this.moveLeft(false);
            }
            if (e.code === "ArrowUp") {
                this.moveUp(false);
            }
            if (e.code === "ArrowDown") {
                this.moveDown(false);
            }
            if (e.code === "Space") {
                this.pressSpacebar(false);
            }
            if (e.code === "KeyD") {
                this.pressD(false);
            }
        });
    }

    /**
     * Registers touch event listeners for all mobile control buttons.
     */
    initMobileKeys() {
        this.#mobileButton(
            "mobile-up-btn-id",
            () => this.moveUp(true),
            () => this.moveUp(false),
        );
        this.#mobileButton(
            "mobile-left-btn-id",
            () => this.moveLeft(true),
            () => this.moveLeft(false),
        );
        this.#mobileButton(
            "mobile-right-btn-id",
            () => this.moveRight(true),
            () => this.moveRight(false),
        );
        this.#mobileButton(
            "mobile-down-btn-id",
            () => this.moveDown(true),
            () => this.moveDown(false),
        );
        this.#mobileButton(
            "mobile-bubble-btn-id",
            () => this.pressD(true),
            () => this.pressD(false),
        );
        this.#mobileButton(
            "mobile-attack-btn-id",
            () => this.pressSpacebar(true),
            () => this.pressSpacebar(false),
        );
    }

    /**
     * Attaches touchstart, touchend, and touchcancel listeners to a mobile button.
     * @param {string} id - The element ID of the button.
     * @param {Function} buttonOn - Callback when the button is pressed.
     * @param {Function} buttonOff - Callback when the button is released or cancelled.
     */
    #mobileButton(id, buttonOn, buttonOff) {
        const btn = document.getElementById(id);

        if (!btn) {
            return;
        }

        btn.addEventListener("touchstart", buttonOn);
        btn.addEventListener("touchend", buttonOff);
        btn.addEventListener("touchcancel", buttonOff);
    }

    /** @param {boolean} boolean - Sets the right movement state. */
    moveRight(boolean) {
        this.right = boolean;
    }

    /** @param {boolean} boolean - Sets the left movement state. */
    moveLeft(boolean) {
        this.left = boolean;
    }

    /** @param {boolean} boolean - Sets the upward movement state. */
    moveUp(boolean) {
        this.up = boolean;
    }

    /** @param {boolean} boolean - Sets the downward movement state. */
    moveDown(boolean) {
        this.down = boolean;
    }

    /** @param {boolean} boolean - Sets the spacebar (attack) state. */
    pressSpacebar(boolean) {
        this.spacebar = boolean;
    }

    /** @param {boolean} boolean - Sets the D key (bubble) state. */
    pressD(boolean) {
        this.d = boolean;
    }
}
