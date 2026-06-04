class Character extends MovableOBject {
    height = 380;
    width = 280;
    x = 0;
    y = 100;

    constructor() {
        super();
        /*super() ruft den Konstruktor der Elternklasse auf;
        in einer abgeleiteten Klasse muss das vor this passieren.*/
        this.loadImage("img/1.Sharkie/1.IDLE/1.png");
        this.loadImages(["img/1.Sharkie/3.Swim/1.png", "img/1.Sharkie/3.Swim/2.png", "img/1.Sharkie/3.Swim/1.png", "img/1.Sharkie/3.Swim/3.png", "img/1.Sharkie/3.Swim/4.png", "img/1.Sharkie/3.Swim/5.png", "img/1.Sharkie/3.Swim/6.png"]);
    }
}
