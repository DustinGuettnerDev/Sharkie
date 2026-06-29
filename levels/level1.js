const level_1 = new Level(
    [
        new Puffer(150, 0.5),
        new JellyFish(550, 0.7),
        new Puffer(950, 1),
        new Puffer(1350, 0.6),
        new JellyFish(1550, 1.4),
        new Endboss(),
    ],

    [
        new Coin(420, 400),
        new Coin(490, 330),
        new Coin(600, 300),
        new Coin(700, 300),
        new Coin(790, 330),
        new Coin(860, 400),

        new PoisonBottle(625, 400, true),

        /*         new Coin(930, 30),
        new Coin(1000, 100),
        new Coin(1100, 130),
        new Coin(1200, 130),
        new Coin(1290, 100),
        new Coin(1360, 30), */
    ],

    [
        new BackgroundObject("img/3. Background/Layers/5. Water/D2.png", -720),
        new BackgroundObject("img/3. Background/Layers/4.Fondo 2/D2.png", -720),
        new BackgroundObject("img/3. Background/Layers/3.Fondo 1/D2.png", -720),
        new BackgroundObject("img/3. Background/Layers/2. Floor/D2.png", -720),

        new BackgroundObject("img/3. Background/Layers/5. Water/D1.png", 0),
        new BackgroundObject("img/3. Background/Layers/4.Fondo 2/D1.png", 0),
        new BackgroundObject("img/3. Background/Layers/3.Fondo 1/D1.png", 0),
        new BackgroundObject("img/3. Background/Layers/2. Floor/D1.png", 0),
        new BackgroundObject("img/3. Background/Layers/1. Light/1.png", 0),

        new BackgroundObject("img/3. Background/Layers/5. Water/D2.png", 720),
        new BackgroundObject("img/3. Background/Layers/4.Fondo 2/D2.png", 720),
        new BackgroundObject("img/3. Background/Layers/3.Fondo 1/D2.png", 720),
        new BackgroundObject("img/3. Background/Layers/2. Floor/D2.png", 720),
        new BackgroundObject("img/3. Background/Layers/1. Light/2.png", 720),

        new BackgroundObject("img/3. Background/Layers/5. Water/D1.png", 1440),
        new BackgroundObject("img/3. Background/Layers/4.Fondo 2/D1.png", 1440),
        new BackgroundObject("img/3. Background/Layers/3.Fondo 1/D1.png", 1440),
        new BackgroundObject("img/3. Background/Layers/2. Floor/D1.png", 1440),
    ],
);
