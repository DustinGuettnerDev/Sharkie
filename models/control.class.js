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

    /**
     * Initializes keyboard and mobile touch controls for the game.
     */
    constructor() {
        this.initKeyboard();
        this.initMobileKeys();
    }

    /**
     * Registers keydown and keyup event listeners for keyboard controls.
     */
    initKeyboard() {
        this.registerKeyboardListener("keydown", true);
        this.registerKeyboardListener("keyup", false);
    }

    /**
     * Registers one keyboard event type and maps keys to movement or attack states.
     * @param {"keydown"|"keyup"} eventName Keyboard event type.
     * @param {boolean} isPressed Target key state for this event type.
     */
    registerKeyboardListener(eventName, isPressed) {
        document.addEventListener(eventName, (event) => this.handleKeyState(event.code, isPressed));
    }

    /**
     * Applies movement or attack state changes for supported keyboard codes.
     * @param {string} keyCode Keyboard code from the browser event.
     * @param {boolean} isPressed Target state to apply.
     */
    handleKeyState(keyCode, isPressed) {
        if (keyCode === "ArrowRight") this.moveRight(isPressed);
        if (keyCode === "ArrowLeft") this.moveLeft(isPressed);
        if (keyCode === "ArrowUp") this.moveUp(isPressed);
        if (keyCode === "ArrowDown") this.moveDown(isPressed);
        if (keyCode === "Space") this.pressSpacebar(isPressed);
        if (keyCode === "KeyD") this.pressD(isPressed);
    }

    /**
     * Registers touch event listeners for all mobile control buttons.
     */
    initMobileKeys() {
        const mobileBindings = [
            ["mobile-up-btn-id", () => this.moveUp(true), () => this.moveUp(false)],
            ["mobile-left-btn-id", () => this.moveLeft(true), () => this.moveLeft(false)],
            ["mobile-right-btn-id", () => this.moveRight(true), () => this.moveRight(false)],
            ["mobile-down-btn-id", () => this.moveDown(true), () => this.moveDown(false)],
            ["mobile-bubble-btn-id", () => this.pressD(true), () => this.pressD(false)],
            [
                "mobile-attack-btn-id",
                () => this.pressSpacebar(true),
                () => this.pressSpacebar(false),
            ],
        ];
        for (const [id, buttonOn, buttonOff] of mobileBindings) {
            this.mobileButton(id, buttonOn, buttonOff);
        }
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

    /**
     * Attaches touchstart, touchend, and touchcancel listeners to a mobile button.
     * @param {string} id - The element ID of the button.
     * @param {Function} buttonOn - Callback when the button is pressed.
     * @param {Function} buttonOff - Callback when the button is released or cancelled.
     */
    mobileButton(id, buttonOn, buttonOff) {
        const btn = document.getElementById(id);
        const handlePress = this.createPointerHandler(btn, true, buttonOn);
        const handleRelease = this.createPointerHandler(btn, false, buttonOff);
        this.registerMobileButtonEvents(btn, handlePress, handleRelease);
    }

    /**
     * Creates a press or release handler with consistent pointer/touch cancellation behavior.
     * @param {HTMLElement} button Target button element.
     * @param {boolean} isPressed Whether this handler is for pressed state.
     * @param {Function} callback Callback to execute after visual state update.
     * @returns {(event: Event) => void} Event handler.
     */
    createPointerHandler(button, isPressed, callback) {
        return (event) => {
            if (event.cancelable) event.preventDefault();
            button.classList.toggle("is-pressed", isPressed);
            callback();
        };
    }

    /**
     * Registers all pointer and touch events used by a mobile control button.
     * @param {HTMLElement} button Target button element.
     * @param {(event: Event) => void} handlePress Press event handler.
     * @param {(event: Event) => void} handleRelease Release event handler.
     */
    registerMobileButtonEvents(button, handlePress, handleRelease) {
        button.addEventListener("pointerdown", handlePress);
        button.addEventListener("pointerup", handleRelease);
        button.addEventListener("pointercancel", handleRelease);
        button.addEventListener("pointerleave", handleRelease);
        button.addEventListener("touchstart", handlePress);
        button.addEventListener("touchend", handleRelease);
        button.addEventListener("touchcancel", handleRelease);
        button.addEventListener("touchleave", handleRelease);
    }
}
