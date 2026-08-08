/**
 * Initializes the main game state by creating the canvas, input controller, storage helper, audio system, and UI controller.
 */
function init() {
    canvas = document.getElementById("canvas");
    control = new Control();
    locStorage = new LocalStorage();
    audioTrack = new AudioTrack();
    uiController = new UIController(canvas, control, locStorage, audioTrack);
}
