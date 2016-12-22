
class Game {

  constructor(options) {
    this.diver = options.diver;

    // this.moveDiver = this.moveDiver.bind(this);
  }

  moveDiver(xDiff, yDiff) {
    this.diver.changePos(xDiff, yDiff);
  }

}

export default Game;
