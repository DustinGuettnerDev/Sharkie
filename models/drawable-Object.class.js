class DrawableObject {
    img;
    imageCache = {};
    x = 0;
    y = 0;
    width = 0;
    height = 0;

    loadImage(path) {
        this.img = new Image(); // this.img = document.getElementById("image") <img id="image"> (unterschied nur im JS)
        this.img.src = path;
    }

    loadImages(arr) {
        for (let path of arr) {
            let img = new Image();
            img.src = path;
            this.imageCache[path] = img;
        }
    }
}
