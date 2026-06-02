class BackgroundObject extends MovableOBject {
    constructor(imagePath) {
        super();
        this.loadImg(imagePath);
        this.x = 0;
        this.y = 0;
        this.height = 480;
        this.width = 720;
    }
}
