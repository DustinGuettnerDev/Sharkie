class MovableOBject {
    img;
    imageCache = {};

    loadImage(path) {
        this.img = new Image(); // this.img = document.getElementById("image") <img id="image"> (unterschied nur im JS)
        this.img.src = path;
    }

    delay(time) {
        return new Promise((resolve) => setTimeout(resolve, time));
    }

    loadImages(arr) {
        for (let path of arr) {
            let img = new Image();
            img.src = path;
            this.imageCache[path] = img;
        }
    }

    moveRight() {
        console.log("moving right");
    }

    moveLeft() {
        console.log("moving left");
    }
}
