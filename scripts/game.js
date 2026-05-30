let canvas;
let ctx;
let wordl = new World();

function init() {
    canvas = document.getElementById("canvas");
    ctx = canvas.getContext("2d");

    console.log(`${character.x} ${character.y} ${character.img}`);
    console.log(`${chicken.x} ${chicken.y} ${chicken.img}`);
}
