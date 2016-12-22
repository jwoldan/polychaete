
const KEYCODE_LEFT = 37,
	    KEYCODE_RIGHT = 39,
		  KEYCODE_UP = 38,
		  KEYCODE_DOWN = 40;

class KeyHandler {

  constructor(game) {
    this.game = game;

    this.handleKeyPress = this.handleKeyPress.bind(this);
  }

  handleKeyPress(e) {
    switch(event.keyCode) {
			case KEYCODE_LEFT:
        e.preventDefault();
				this.game.moveDiver(-8, 0);
				break;
			case KEYCODE_RIGHT:
        e.preventDefault();
				this.game.moveDiver(8, 0);
				break;
			case KEYCODE_UP:
        e.preventDefault();
				this.game.moveDiver(0, -8);
				break;
			case KEYCODE_DOWN:
        e.preventDefault();
				this.game.moveDiver(0, 8);
				break;
		}
  }

  attachListeners() {
    document.addEventListener('keydown', this.handleKeyPress);
  }

  removeListeners() {
    document.removeEventListener('keydown', this.handleKeyPress);
  }

}

export default KeyHandler;
