class CollidableObject extends DrawableObject {
    collisionOffset = {
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
    };

    isColliding(drawObject) {
        return (
            this.x + this.width - this.collisionOffset.right >
                drawObject.x + drawObject.collisionOffset.left &&
            this.y + this.height - this.collisionOffset.bottom >
                drawObject.y + drawObject.collisionOffset.top &&
            this.x + this.collisionOffset.left <
                drawObject.x + drawObject.width - drawObject.collisionOffset.right &&
            this.y + this.collisionOffset.top <
                drawObject.y + drawObject.height - drawObject.collisionOffset.bottom
        );
    }
}
