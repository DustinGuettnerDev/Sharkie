let canvas = null;
let control = null;
let uiController = null;
let locStorage = null;

/**
 * Initializes the game by creating the canvas, input controller, and UI controller.
 */
function init() {
    canvas = document.getElementById("canvas");
    control = new Control();
    locStorage = new LocalStorage();
    uiController = new UIController(canvas, control, locStorage);
}
