import { DIVER_MOVE_AMOUNT } from '../objects/diver';

const KEYCODE_LEFT = 37,
			KEYCODE_A = 65,
	    KEYCODE_RIGHT = 39,
			KEYCODE_D = 68,
		  KEYCODE_UP = 38,
			KEYCODE_W = 87,
		  KEYCODE_DOWN = 40,
			KEYCODE_S = 83,
			KEYCODE_SPACE = 32;

const controlKeys = [
	KEYCODE_LEFT,
	KEYCODE_A,
  KEYCODE_RIGHT,
	KEYCODE_D,
  KEYCODE_UP,
	KEYCODE_W,
  KEYCODE_DOWN,
	KEYCODE_S,
	KEYCODE_SPACE
];

const DIAG_MOVE_AMOUNT = Math.sqrt((DIVER_MOVE_AMOUNT * DIVER_MOVE_AMOUNT) / 2);

class KeyHandler {

  constructor(game, stage) {
    this.game = game;
		this.stage = stage;
		this.reset();

    this.handleKeyDown = this.handleKeyDown.bind(this);
		this.handleKeyUp = this.handleKeyUp.bind(this);
		this.handleTick = this.handleTick.bind(this);
  }

	reset() {
		this.keysDown = {};
		controlKeys.forEach((key)=> {
			this.keysDown[key] = false;
		});
	}

  handleKeyDown(e) {
		if (this.game.started) {
			if (e.keyCode === KEYCODE_SPACE && !this.keysDown[e.keyCode]) {
				this.game.fireLaser();
			}
			if (controlKeys.includes(e.keyCode)) {
				e.preventDefault();
				this.keysDown[e.keyCode] = true;
			}
		}
  }

	handleKeyUp(e) {
		if (this.game.started) {
			if (controlKeys.includes(e.keyCode)) {
				e.preventDefault();
				this.keysDown[e.keyCode] = false;
			}
		}
	}

	handleTick(e) {
		if (e.paused) return;

		let diagMove = false;
		if (this.leftUpPressed()) {
			this.game.moveDiver(
				-DIAG_MOVE_AMOUNT,
				-DIAG_MOVE_AMOUNT
			);
			diagMove = true;
		}
		if (this.rightUpPressed()) {
			this.game.moveDiver(
				DIAG_MOVE_AMOUNT,
				-DIAG_MOVE_AMOUNT
			);
			diagMove = true;
		}
		if (this.leftDownPressed()) {
			this.game.moveDiver(
				-DIAG_MOVE_AMOUNT,
				DIAG_MOVE_AMOUNT
			);
			diagMove = true;
		}
		if (this.rightDownPressed()) {
			this.game.moveDiver(
				DIAG_MOVE_AMOUNT,
				DIAG_MOVE_AMOUNT
			);
			diagMove = true;
		}

		if (!diagMove) {
			if (this.leftPressed()) {
				this.game.moveDiver(-DIVER_MOVE_AMOUNT, 0);
			}
			if (this.rightPressed()) {
				this.game.moveDiver(DIVER_MOVE_AMOUNT, 0);
			}

			if (this.upPressed()) {
				this.game.moveDiver(0, -DIVER_MOVE_AMOUNT);
			}

			if (this.downPressed()) {
				this.game.moveDiver(0, DIVER_MOVE_AMOUNT);
			}
		}

	}

	leftPressed() {
		return this.keysDown[KEYCODE_LEFT] || this.keysDown[KEYCODE_A];
	}

	rightPressed() {
		return this.keysDown[KEYCODE_RIGHT] || this.keysDown[KEYCODE_D];
	}

	upPressed() {
		return this.keysDown[KEYCODE_UP] || this.keysDown[KEYCODE_W];
	}

	downPressed() {
		return this.keysDown[KEYCODE_DOWN] || this.keysDown[KEYCODE_S];
	}

	leftUpPressed() {
		return this.leftPressed() && this.upPressed();
	}

	rightUpPressed() {
		return this.rightPressed() && this.upPressed();
	}

	leftDownPressed() {
		return this.leftPressed() && this.downPressed();
	}

	rightDownPressed() {
		return this.rightPressed() && this.downPressed();
	}

  attachListeners() {
    document.addEventListener('keydown', this.handleKeyDown);
		document.addEventListener('keyup', this.handleKeyUp);
  }

  removeListeners() {
    document.removeEventListener('keydown', this.handleKeyDown);
		document.removeEventListener('keyup', this.handleKeyUp);
  }

}

export default KeyHandler;
