class BackgroundObject extends MovableObject {
    height = 480;
    width = 720;
    x = 0;
    y = 0;

    constructor(imagePath) {
        super();
        /*this.function() ruft eine Methode auf der aktuellen Instanz auf.
        Wenn die Methode in der Kindklasse existiert, wird die Kind-Methode genutzt (Override).
        Wenn nicht, wird die geerbte Eltern-Methode genutzt.

        super.function() ruft gezielt die Methode der Elternklasse auf.
        Das nutzt man, wenn man die Eltern-Version ausdrücklich haben will.*/
        this.loadImage(imagePath);
    }
}
