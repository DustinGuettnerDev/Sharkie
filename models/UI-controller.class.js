/**
 * UIController class manages the user interface elements and game state related to starting the game and invincibility mode.
 */
class UIController {
    start = false;
    invincibleMode = true;
    startButtonRef = document.getElementById("start-button");

    startGame() {
        this.start = true;
        this.invincibleMode = false;
        this.startButtonRef.style.display = "none";
    }
}
