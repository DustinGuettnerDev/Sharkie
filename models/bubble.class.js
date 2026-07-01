class Bubble extends MovableObject {
    height = 60;
    width = 60;
    x;
    y;
    forward;
    speed = 2;

    world;
    isPoisonBubble;
    imageBubble = "img/1.Sharkie/4.Attack/Bubble trap/Bubble.png";
    imagePoisonBubble = "img/1.Sharkie/4.Attack/Bubble trap/Poisoned Bubble (for whale).png";

    constructor(x = 0, y = 0, forward = true, world = null, isPoisonBubble = false) {
        super();
        this.x = x;
        this.y = y;
        this.forward = forward;
        this.world = world;
        this.isPoisonBubble = isPoisonBubble;
        this.movement();
        this.setBubbleImage(isPoisonBubble);
    }

    setBubbleImage() {
        if (this.isPoisonBubble) {
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
