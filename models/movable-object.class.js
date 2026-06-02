class MovableOBject {
    x;
    y;
    img;
    height;
    width;

    loadImg(path) {
        this.img = new Image(); // this.img = document.getElementById("image") <img id="image"> (unterschied nur im JS)
        this.img.src = path;
    }

    moveRight() {
        console.log("moving right");
    }

    moveLeft() {
        console.log("moving left");
    }
}
