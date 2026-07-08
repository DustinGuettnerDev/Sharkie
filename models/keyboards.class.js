/**
 * Represents the keyboard input state for controlling the game character.
 */
class Keyboard {
    right = false;
    left = false;
    up = false;
    down = false;
    spacebar = false;
    d = false;

    constructor() {
        document.addEventListener("keydown", (e) => {
            if (e.code === "ArrowRight") {
                this.right = true;
            }
            if (e.code === "ArrowLeft") {
                this.left = true;
            }
            if (e.code === "ArrowUp") {
                this.up = true;
            }
            if (e.code === "ArrowDown") {
                this.down = true;
            }
            if (e.code === "Space") {
                this.spacebar = true;
            }
            if (e.code === "KeyD") {
                this.d = true;
            }
        });

        document.addEventListener("keyup", (e) => {
            if (e.code === "ArrowRight") {
                this.right = false;
            }
            if (e.code === "ArrowLeft") {
                this.left = false;
            }
            if (e.code === "ArrowUp") {
                this.up = false;
            }
            if (e.code === "ArrowDown") {
                this.down = false;
            }
            if (e.code === "Space") {
                this.spacebar = false;
            }
            if (e.code === "KeyD") {
                this.d = false;
            }
        });
    }
}
