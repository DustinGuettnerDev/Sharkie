class CollidableObject extends DrawableObject {
    offset = {
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
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
