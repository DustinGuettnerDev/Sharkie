let canvas = null;
let world = null;
let keyboard = new Keyboard();
let uiController = null;

/**
 * Initializes the game by setting up the canvas and creating a new World instance with the provided keyboard input.
 */
function init() {
    canvas = document.getElementById("canvas");
    uiController = new UIController();
}
