class World {
    character = new Character(this);
    hudIcons = createHudIcons(this, this.character);
    level = level_1;
    ctx;
    canvas;
    keyboard;
    camera_x = 0;
    bubbles = [];
    invincibleMode = true;
    coinsTillLife = 7;
    maxPoisonBottleCollected = 2;

    constructor(canvas, keyboard) {
        this.canvas = canvas;
        this.ctx = canvas.getContext("2d"); // 2d zeichenkontext wird in ctx gespeichert
        this.keyboard = keyboard;
        this.setWorld();
        this.render();
        this.checkCollisionsOrAggroRange();
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
        this.addObjectsToMap(this.isVisibleFilter(this.level.collectible));
        this.addObjectsToMap(this.bubbles);
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

    checkCollisionsOrAggroRange() {
        setInterval(() => {
            this.enemyCollision();
            this.collectibleCollision();
            this.bubbleCollision();
        }, 400);
    }

    enemyCollision() {
        for (let enemy of this.level.enemies) {
            if (
                this.character.isColliding(enemy) &&
                !this.character.hasZeroLife() &&
                !this.character.isHurt() &&
                enemy.death !== true
            ) {
                if (this.character.slap === true) {
                    if (enemy.weakness.includes("slap")) {
                        enemy.getHit(); // logik passt noch nicht ganz
                        if (enemy.lifeCount === 0) {
                            enemy.death = true;
                        }
                    }
                } else if (!this.invincibleMode) {
                    this.character.getHit(enemy);
                }
            }
        }
    }

    collectibleCollision() {
        for (let collectible of this.level.collectible) {
            this.coinCollision(collectible);
            this.poisonBottleCollison(collectible);
        }
    }

    coinCollision(collectible) {
        if (collectible instanceof Coin) {
            if (this.character.isColliding(collectible)) {
                this.level.collectible = this.level.collectible.filter((e) => e !== collectible);
                this.character.coinCount += 1;
                if (this.character.coinCount >= this.coinsTillLife) {
                    this.character.lifeCount += 1;
                    this.character.coinCount = 0;
                }
            }
        }
    }

    poisonBottleCollison(collectible) {
        if (collectible instanceof PoisonBottle) {
            if (
                this.character.isColliding(collectible) &&
                collectible.isVisible &&
                this.character.poisonBottleCount < this.maxPoisonBottleCollected
            ) {
                collectible.deactivateForTime();
                this.character.poisonBottleCount += 1;
            }
        }
    }

    bubbleCollision() {
        for (let bubble of this.bubbles)
            for (let enemy of this.level.enemies) {
                if (bubble.isColliding(enemy) && enemy.death == false) {
                    if (
                        (enemy.weakness.includes("bubble") && bubble.isPoisonBubble == false) ||
                        (enemy.weakness.includes("poison-bubble") && bubble.isPoisonBubble == true)
                    ) {
                        enemy.getHit();
                        if (enemy.hasZeroLife()) {
                            enemy.death = true;
                        }
                    }
                    bubble.removeFromWorld();
                    break;
                }
            }
    }

    spawnBubble() {
        let range = 50;
        let x;
        let y = this.character.y + 200;
        let forward;
        let isPoisonBubble = this.character.poisonBottleCount > 0;
        if (this.character.otherDirection) {
            x = this.character.x - range;
            forward = false;
        } else {
            x = this.character.x + range + this.character.width - 50;
            forward = true;
        }
        if (isPoisonBubble) {
            this.character.poisonBottleCount = Math.max(0, this.character.poisonBottleCount - 1);
        }
        this.bubbles.push(new Bubble(x, y, forward, this, isPoisonBubble));
    }

    setWorld() {
        for (let enemy of this.level.enemies) {
            if (enemy instanceof Puffer || enemy instanceof Endboss) {
                enemy.world = this;
            }
        }
    }

    isVisibleFilter(drawObject) {
        return drawObject.filter(
            (collectible) => !(collectible instanceof PoisonBottle) || collectible.isVisible,
        );
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
        for (let icon of this.hudIcons) {
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
        if (drawObject.img) {
            this.ctx.drawImage(
                drawObject.img,
                drawObject.x,
                drawObject.y,
                drawObject.width,
                drawObject.height,
            );
        }
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
            drawObject instanceof Coin ||
            drawObject instanceof Bubble ||
            drawObject instanceof PoisonBottle
        ) {
            this.ctx.beginPath();
            this.ctx.lineWidth = "5";
            this.ctx.strokeStyle = "red";
            this.ctx.rect(
                drawObject.x + drawObject.collisionOffset.left,
                drawObject.y + drawObject.collisionOffset.top,
                drawObject.width -
                    drawObject.collisionOffset.left -
                    drawObject.collisionOffset.right,
                drawObject.height -
                    drawObject.collisionOffset.top -
                    drawObject.collisionOffset.bottom,
            );
            this.ctx.stroke();

            if (drawObject.aggroOffset) {
                this.ctx.beginPath();
                this.ctx.lineWidth = "5";
                this.ctx.strokeStyle = "yellow";
                this.ctx.rect(
                    drawObject.x + drawObject.aggroOffset.left,
                    drawObject.y + drawObject.aggroOffset.top,
                    drawObject.width - drawObject.aggroOffset.left - drawObject.aggroOffset.right,
                    drawObject.height - drawObject.aggroOffset.top - drawObject.aggroOffset.bottom,
                );
                this.ctx.stroke();
            }
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
