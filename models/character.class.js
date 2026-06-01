class Character extends MovableOBject {
    constructor() {
        super();
        /*super() ruft den Konstruktor der Elternklasse auf;
        in einer abgeleiteten Klasse muss das vor this passieren.*/
        this.loadImg("img/1.Sharkie/1.IDLE/1.png");
        this.clickHandler();
        this.height = 300;
        this.width = 200;
        this.x = 20;
        this.y = 200;
    }

    // Add event listener for key press
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
        this.x += 6;
    }

    moveLeft() {
        this.x -= 6;
    }

    moveUp() {
        this.y -= 6;
    }

    moveDown() {
        this.y += 6;
    }
}
