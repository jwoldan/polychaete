
class Game {

  constructor(options) {
    this.diver = options.diver;

    // this.moveDiver = this.moveDiver.bind(this);
  }

  moveDiver(xDiff, yDiff) {
    this.diver.changeBoundedPos(xDiff, yDiff);
  }

  fireLaser() {
    this.diver.fireLaser();
  }

}

export default Game;
