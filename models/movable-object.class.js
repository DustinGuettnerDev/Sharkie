class MovableObject {
    img;
    imageCache = {};
    currentImage = 0;
    speed = 1;

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

    moveLeft() {
        setInterval(() => {
            this.x -= this.speed;
        }, 1000 / 60); // für 60 Hz 1000 / 60 = 60 mal die sekunde
    }
}
