class Keyboard {
    right = false;
    left = false;
    up = false;
    down = false;
    slap = false;

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
                this.slap = true;
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
                this.slap = false;
            }
        });
    }
}
