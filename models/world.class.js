class World {
    character = new Character();
    poison = new HudIcon({
        path: "img/4. Marcadores/HUD-icons/poison.png",
        x: 30,
        y: 20,
        height: 80,
        width: 80,
        fontOffsetY: 10,
        iconValue: this.character.poison,
        kind: "poison",
    });

    life = new HudIcon({
        path: "img/4. Marcadores/HUD-icons/life.png",
        x: 150,
        y: 30,
        iconValue: this.character.life,
        kind: "life",
    });

    coins = new HudIcon({
        path: "img/4. Marcadores/HUD-icons/coins.png",
        x: 270,
        y: 35,
        fontOffsetY: -5,
        iconValue: this.character.coins,
        kind: "coins",
    });
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
        this.addObjectsToMap(this.level.coins);
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
            this.enemieCollision();
            this.coinCollision();
        }, 400);
    }

    enemieCollision() {
        for (let enemy of this.level.enemies) {
            if (
                this.character.isColliding(enemy) &&
                !this.character.hasZeroLife() &&
                !this.character.isHurt()
            ) {
                this.character.getHit();
            }
        }
    }

    coinCollision() {
        for (let coin of this.level.coins) {
            if (this.character.isColliding(coin)) {
                this.level.coins = this.level.coins.filter((e) => e !== coin);
                this.character.coins += 1;
                if (this.character.coins >= 5) {
                    this.character.life += 1;
                    this.character.coins = 0;
                }
            }
        }
    }

    setWorld() {
        this.character.world = this;
        this.life.world = this;
        this.poison.world = this;
        this.coins.world = this;
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
        const hudIcons = [this.life, this.poison, this.coins];

        for (let icon of hudIcons) {
            this.addToMap(icon);
            icon.updateValue();
            this.drawValue({
                text: icon.iconValue,
                x: icon.x + 70,
                y: icon.y + 50 + icon.fontOffsetY,
            });
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

    drawValue({ text, x, y, font = "24px Arial", fillStyle = "white" }) {
        this.ctx.font = font;
        this.ctx.fillStyle = fillStyle;
        this.ctx.fillText(`x ${text}`, x, y);
    }

    drawFrame(drawObject) {
        if (
            drawObject instanceof Character ||
            drawObject instanceof Puffer ||
            drawObject instanceof JellyFish ||
            drawObject instanceof Endboss ||
            drawObject instanceof Coin
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
