class UIHandler {

  constructor(game) {
    this.game = game;
    this.currentScoreElement = document.getElementById('current-score');
    this.highScoreElement = document.getElementById('high-score');
    this.startGamePopup = document.getElementById('popup-start');
    this.startButton = document.getElementById('button-start');
    this.gameOverPopup = document.getElementById('popup-gameover');
    this.restartButton = document.getElementById('button-restart');
    this.gameOverScore = document.getElementById('gameover-score');
    this.gameOverHighScoreMessage =
      document.getElementById('gameover-high-score-message');
    this.aboutPopup = document.getElementById('popup-about');
    this.aboutButton = document.getElementById('button-about');
    this.aboutCloseButton = document.getElementById('button-about-close');

    this.startGame = this.startGame.bind(this);
    this.toggleAboutPopup = this.toggleAboutPopup.bind(this);

    this.startButton.addEventListener('click', this.startGame);
    this.restartButton.addEventListener('click', this.startGame);
    this.aboutButton.addEventListener('click', this.toggleAboutPopup);
    this.aboutCloseButton.addEventListener('click', this.toggleAboutPopup);
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

  hideStartGamePopup() {
    this.startGamePopup.className = "popup hidden";
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

  toggleAboutPopup() {
    if (this.aboutPopup.className === "popup") {
      this.game.setPaused(false);
      this.aboutPopup.className = "popup hidden";
    } else {
      this.game.setPaused(true);
      this.aboutPopup.className = "popup";
    }
  }

  startGame() {
    this.game.initialize(true);
    this.hideStartGamePopup();
    this.hideGameOverPopup();
  }
}

export default UIHandler;
