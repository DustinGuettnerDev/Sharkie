class World {
    character = new Character();
    hudIcons = [
        new HudIcon("img/4. Marcadores/HUD-icons/poison.png", 30, 20, 0, 80, 80),
        new HudIcon("img/4. Marcadores/HUD-icons/life.png", 150, 30, 10),
        new HudIcon("img/4. Marcadores/HUD-icons/coins.png", 270, 30, 0),
    ];
    level = level_1;
    ctx;
    canvas;
    keyboard;
    camera_x = 0;

    constructor(canvas, keyboard) {
        this.canvas = canvas;
        this.ctx = canvas.getContext("2d"); // 2d zeichenkontext wird in ctx gespeichert
        this.keyboard = keyboard;
        this.setWorld();
        this.render();
        this.checkCollisions();
    }

    render() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height); //Inhalt des canvas wird damit gelöscht

        this.ctx.translate(this.camera_x, 0);
        /* der rand oben und links sind jeweils die 0 werte bei der achse
        wenn der charackter 100 nach vorne läuft, wird mit translate 100  nach links verschoben,
        Dann wird alles reingezeichnet sowohl charackter als auch alle background-elemente etc. und es
        wird danach wieder nach vorne verschoben
        */

        // alle beweglichen objekte
        this.addObjectsToMap(this.level.backgroundObjects);
        this.addObjectsToMap(this.level.enemies);
        this.addToMap(this.character);

        this.ctx.translate(-this.camera_x, 0);

        // alle gesten objekte
        this.addHudIconsToMap();

        // draw() wird immer wieder aufgerufen
        requestAnimationFrame(() => {
            // function = eigenes this (sonst müsste man außen = let self = this, drinne = self.draw), => = übernimmt this aus dem äußeren Scope
            // plant den naechsten draw()-Aufruf fuer den naechsten Render-Zyklus; bei zu geringer Leistung sinkt die FPS
            this.render();
        });
    }

    checkCollisions() {
        setInterval(() => {
            for (let enemy of this.level.enemies) {
                if (this.character.isColliding(enemy) && this.character.energy > 0) {
                    this.character.energy -= 20;
                    console.log("energy: ", this.character.energy);
                }
            }
        }, 400);
    }

    setWorld() {
        this.character.world = this;
        for (let hudIcon of this.hudIcons) {
            hudIcon.world = this;
        }
    }

    addObjectsToMap(drawObjects) {
        for (let drawObject of drawObjects) {
            this.addToMap(drawObject);
        }
    }

    addToMap(drawObject) {
        this.flipImage(drawObject);

        this.draw(drawObject);
        this.drawFrame(drawObject);

        this.flipImageBack(drawObject);
    }

    addHudIconsToMap() {
        this.addObjectsToMap(this.hudIcons);
        for (let hudIcon of this.hudIcons) {
            hudIcon.drawHudIconValue();
        }
    }

    draw(drawObject) {
        this.ctx.drawImage(
            drawObject.img,
            drawObject.x,
            drawObject.y,
            drawObject.width,
            drawObject.height,
        );
    }

    drawFrame(drawObject) {
        if (
            drawObject instanceof Character ||
            drawObject instanceof Puffer ||
            drawObject instanceof Endboss
        ) {
            this.ctx.beginPath();
            this.ctx.lineWidth = "5";
            this.ctx.strokeStyle = "blue";
            this.ctx.rect(
                drawObject.x + drawObject.offset.left,
                drawObject.y + drawObject.offset.top,
                drawObject.width - drawObject.offset.left - drawObject.offset.right,
                drawObject.height - drawObject.offset.top - drawObject.offset.bottom,
            );
            this.ctx.stroke();
        }
    }

    flipImage(drawObject) {
        if (drawObject.otherDirection) {
            // Aktuellen Zeichenzustand speichern, damit die Spiegelung nur dieses Objekt betrifft.
            this.ctx.save();

            // Den Ursprung um die Objektbreite nach rechts verschieben.
            // |    x|x img |  -> | img x|x    | -> um breite des objekts nach rechts verschieben
            this.ctx.translate(drawObject.width, 0);

            // X-Achse spiegeln: positive X-Werte zeigen jetzt nach links,
            // negative X-Werte zeigen nach rechts.
            this.ctx.scale(-1, 1);

            //Da die rechte Seite durch scale jetzt minuswerte hat muss die x-position angepasst werden
            //und mit -1 verrechnet werden
            drawObject.x *= -1;
        }
    }

    flipImageBack(drawObject) {
        if (drawObject.otherDirection) {
            // x wieder zurück auf den echten Spielwert setzen,
            // damit Bewegung und Kollision im nächsten Frame korrekt berechnet werden.
            drawObject.x *= -1;

            // Zeichenzustand wiederherstellen (macht translate und scale rückgängig).
            this.ctx.restore();
        }
    }
}
