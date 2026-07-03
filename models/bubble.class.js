class Bubble extends MovableObject {
    height = 60;
    width = 60;
    x;
    y;
    forward;
    speed = 2;
    movementInterval;

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
        this.setBubbleImage(isPoisonBubble);
        this.movement();
    }

    setBubbleImage() {
        if (this.isPoisonBubble) {
            this.loadImage(this.imagePoisonBubble);
        } else {
            this.loadImage(this.imageBubble);
        }
    }

    movement() {
        let bubbleStartPosition = this.world.character.x;
        this.movementInterval = setInterval(() => {
            if (this.forward) {
                this.moveRight();
            } else {
                this.moveLeft();
            }

            if (this.rangeReached(400, bubbleStartPosition)) {
                this.removeFromWorld();
            }
        }, this.movementTickMs);
    }

    removeFromWorld() {
        if (this.world) {
            this.world.bubbles = this.world.bubbles.filter((bubble) => bubble !== this);
        }
        if (this.movementInterval) {
            clearInterval(this.movementInterval);
        }
    }

    rangeReached(range, bubbleStart) {
        return Math.abs(bubbleStart - this.x) >= range;
    }
}
