class Bubble extends MovableObject {
    height = 60;
    width = 60;
    x;
    y;
    forward;
    poison = false;
    speed = 2;

    offset = {
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
    };

    imageBubble = "img/1.Sharkie/4.Attack/Bubble trap/Bubble.png";
    imagePoisonBubble = "img/1.Sharkie/4.Attack/Bubble trap/Bubble.png";

    constructor(x = 0, y = 0, forward = true) {
        super();
        this.x = x;
        this.y = y;
        this.forward = forward;
        this.movement();
        this.createBubbleOrPoisonBubble();
    }

    createBubbleOrPoisonBubble() {
        if (this.poison) {
            this.loadImage(this.imagePoisonBubble);
        } else {
            this.loadImage(this.imageBubble);
        }
    }

    movement() {
        setInterval(() => {
            if (this.forward) {
                this.moveRight();
            } else {
                this.moveLeft();
            }
        }, this.movementTickMs);
    }
}
