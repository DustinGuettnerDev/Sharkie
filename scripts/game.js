let canvas;
let world;
let keyboard = new Keyboard();
let uiController;

/**
 * Initializes the game by setting up the canvas and creating a new World instance with the provided keyboard input.
 */
function init() {
    canvas = document.getElementById("canvas");
    uiController = new UIController();
    world = new World(canvas, keyboard, uiController);
}
