let canvas;
let world;
let keyboard = new Keyboard();

function init() {
    canvas = document.getElementById("canvas");
    world = new World(canvas, keyboard);
}

document.addEventListener("keydown", (e) => {
    if (e.key === "ArrowRight") {
        keyboard.right = true;
    }
    if (e.key === "ArrowLeft") {
        keyboard.left = true;
    }
    if (e.key === "ArrowUp") {
        keyboard.up = true;
    }
    if (e.key === "ArrowDown") {
        keyboard.down = true;
    }
});

document.addEventListener("keyup", (e) => {
    if (e.key === "ArrowRight") {
        keyboard.right = false;
    }
    if (e.key === "ArrowLeft") {
        keyboard.left = false;
    }
    if (e.key === "ArrowUp") {
        keyboard.up = false;
    }
    if (e.key === "ArrowDown") {
        keyboard.down = false;
    }
});
