/**
 * Initializes the game by creating the canvas, input controller, and UI controller.
 */
function init() {
    canvas = document.getElementById("canvas");
    control = new Control();
    locStorage = new LocalStorage();
    audioTrack = new AudioTrack();
    uiController = new UIController(canvas, control, locStorage, audioTrack);
}
