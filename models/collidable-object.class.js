class CollidableObject extends DrawableObject {
    offset = {
        top: 180,
        bottom: 100,
        left: 55,
        right: 55,
    };

    isColliding(drawObject) {
        return (
            this.x + this.width - this.offset.right > drawObject.x + drawObject.offset.left &&
            this.y + this.height - this.offset.bottom > drawObject.y + drawObject.offset.top &&
            this.x + this.offset.left < drawObject.x + drawObject.width - drawObject.offset.right &&
            this.y + this.offset.top < drawObject.y + drawObject.height - drawObject.offset.bottom
        );
    }
}
