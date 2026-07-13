/**
 * UIController class manages the user interface elements and game state related to starting the game and invincibility mode.
 */
class UIController {
    gameStarted = false;

    startGame() {
        this.gameStarted = true;
        world = new World(canvas, keyboard, uiController);
        document.getElementById("start-button-id").classList.add("hidden");
    }

    /**
     * Restarts the game and reveals the game over or victory screen based on the game state.
     */
    restartGame() {
        this.gameStarted = true;
        document.getElementById("game-over-container-id").classList.add("hidden");
        document.getElementById("game-over-id").classList.add("hidden");
        document.getElementById("you-win-id").classList.add("hidden");
        world.stopAllLoops();
        world = new World(canvas, keyboard, uiController);
    }

    showInstructions() {
        document.getElementById("instructions-id").classList.toggle("hidden");
        if (this.gameStarted) return;
        document.getElementById("start-button-id").classList.toggle("hidden");
    }
}
