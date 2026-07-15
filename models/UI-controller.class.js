/**
 * Manages game UI elements and basic UI state transitions (start, restart, and instructions).
 */
class UIController {
    gameStarted = false;
    startButton = null;
    gameEndContainer = null;
    gameOverImage = null;
    youWinImage = null;
    instructionsContainer = null;

    /**
     * Caches frequently used DOM elements to avoid repeated document lookups.
     */
    constructor() {
        this.startButton = document.getElementById("start-button-id");
        this.gameEndContainer = document.getElementById("game-end-container-id");
        this.gameOverImage = document.getElementById("game-over-id");
        this.youWinImage = document.getElementById("you-win-id");
        this.instructionsContainer = document.getElementById("instructions-id");
    }

    /**
     * Starts a new game world and hides the start button.
     */
    startGame() {
        this.gameStarted = true;
        world = new World(canvas, keyboard, uiController);
        this.startButton.classList.add("hidden");
    }

    /**
     * Restarts the game by hiding end-game UI and creating a fresh world instance.
     */
    restartGame() {
        this.gameStarted = true;
        this.gameEndContainer.classList.add("hidden");
        this.gameOverImage.classList.add("hidden");
        this.youWinImage.classList.add("hidden");
        world.stopAllLoops();
        world = new World(canvas, keyboard, uiController);
    }

    /**
     * Toggles the instructions overlay and updates start button visibility before the game starts.
     */
    showInstructions() {
        this.instructionsContainer.classList.toggle("hidden");
    }
}
