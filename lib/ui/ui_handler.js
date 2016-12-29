class UIHandler {

  constructor(game) {
    this.game = game;
    this.currentScoreElement = document.getElementById('current-score');
    this.highScoreElement = document.getElementById('high-score');
    this.gameOverPopup = document.getElementById('popup-gameover');
    this.restartButton = document.getElementById('button-restart');
    this.gameOverScore = document.getElementById('gameover-score');
    this.gameOverHighScoreMessage =
      document.getElementById('gameover-high-score-message');
    this.restartGame = this.restartGame.bind(this);

    this.restartButton.addEventListener('click', this.restartGame);
  }

  updateCurrentScore(newCurrentScore) {
    if (this.currentScoreElement) {
      this.currentScoreElement.innerText = newCurrentScore;
    }
  }

  updateHighScore(newHighScore) {
    if (this.highScoreElement) {
      this.highScoreElement.innerText = newHighScore;
    }
  }

  showGameOverPopup(newHighScore) {
    this.gameOverPopup.className = "popup";
    this.gameOverScore.innerText = this.currentScoreElement.innerText;
    if (newHighScore) {
      this.gameOverHighScoreMessage.innerText = "New High Score!";
    }
  }

  hideGameOverPopup() {
    this.gameOverPopup.className = "popup hidden";
  }

  restartGame() {
    this.game.initialize();
    this.hideGameOverPopup();
  }
}

export default UIHandler;
