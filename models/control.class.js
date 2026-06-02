class Control {
    constructor() {
        this.clickHandler();
    }

    clickHandler() {
        document.addEventListener("keydown", (event) => {
            switch (event.key) {
                case "ArrowUp":
                    this.moveUp();
                    break;
                case "ArrowDown":
                    this.moveDown();
                    break;
                case "ArrowLeft":
                    this.moveLeft();
                    break;
                case "ArrowRight":
                    this.moveRight();
                    break;
            }
        });
    }

    moveRight() {
        console.log("right");
    }

    moveLeft() {
        console.log("left");
    }

    moveUp() {
        console.log("up");
    }

    moveDown() {
        console.log("down");
    }
}
