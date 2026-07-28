let canvas = null;
let world = null;
let control = null;
let uiController = null;

/**
 * Initializes the game by setting up the canvas, control input, and UI controller.
 */
function init() {
    canvas = document.getElementById("canvas");
    control = new Control();
    uiController = new UIController();
}
