let canvas;
let world;
let keyboard = new Keyboard();

/**
 * Initializes the game by setting up the canvas and creating a new World instance with the provided keyboard input.
 */
function init() {
    canvas = document.getElementById("canvas");
    world = new World(canvas, keyboard);
}
