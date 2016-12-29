class UIHandler {

  constructor() {
    this.currentScoreElement = document.getElementById('current-score');
    this.highScoreElement = document.getElementById('high-score');
    this.gameOverPopup = document.getElementById('popup-gameover');
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
}

export default UIHandler;
