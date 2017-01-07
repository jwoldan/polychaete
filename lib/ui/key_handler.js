import { DIVER_MOVE_AMOUNT } from '../objects/diver';

const KEYCODE_LEFT = 37,
			KEYCODE_A = 65,
	    KEYCODE_RIGHT = 39,
			KEYCODE_D = 68,
		  KEYCODE_UP = 38,
			KEYCODE_W = 87,
		  KEYCODE_DOWN = 40,
			KEYCODE_S = 83,
			KEYCODE_SPACE = 32,
			KEYCODE_CMD_LEFT = 91,
			KEYCODE_CMD_RIGHT = 93,
			KEYCODE_CTRL = 17;

const controlKeys = [
	KEYCODE_LEFT,
	KEYCODE_A,
  KEYCODE_RIGHT,
	KEYCODE_D,
  KEYCODE_UP,
	KEYCODE_W,
  KEYCODE_DOWN,
	KEYCODE_S,
	KEYCODE_SPACE,
];

const BOMB_KEYS = new Set([KEYCODE_CMD_LEFT, KEYCODE_CMD_RIGHT, KEYCODE_CTRL]);

const DIAG_MOVE_AMOUNT = Math.sqrt((DIVER_MOVE_AMOUNT * DIVER_MOVE_AMOUNT) / 2);
const ACCELERATION_START = 0.25;
const ACCELERATION_INCREMENT = 0.25;

class KeyHandler {

  constructor(game, stage) {
    this.game = game;
		this.stage = stage;
		this.reset();

    this.handleKeyDown = this.handleKeyDown.bind(this);
		this.handleKeyUp = this.handleKeyUp.bind(this);
		this.acceleration = ACCELERATION_START;
  }

	reset() {
		this.keysDown = {};
		controlKeys.forEach((key)=> {
			this.keysDown[key] = false;
		});
	}

  handleKeyDown(e) {
		if (e.keyCode === KEYCODE_SPACE && !this.keysDown[e.keyCode]) {
			this.game.fireLaser();
		} else if (BOMB_KEYS.has(e.keyCode) && !this.keysDown[e.keyCode]) {
			this.game.dropBomb();
		}
		if (controlKeys.includes(e.keyCode)) {
			e.preventDefault();
			this.keysDown[e.keyCode] = true;
		}
  }

	handleKeyUp(e) {
		if (controlKeys.includes(e.keyCode)) {
			e.preventDefault();
			this.keysDown[e.keyCode] = false;
		}
	}

	handleTick(e) {
		if (e.paused) return;

		const diagMoveAmount = DIAG_MOVE_AMOUNT * this.acceleration;
		const moveAmount = DIVER_MOVE_AMOUNT * this.acceleration;

		let move = false;
		let diagMove = false;
		if (this.leftUpPressed()) {
			this.game.moveDiver(
				-diagMoveAmount,
				-diagMoveAmount
			);
			diagMove = true;
		}
		if (this.rightUpPressed()) {
			this.game.moveDiver(
				diagMoveAmount,
				-diagMoveAmount
			);
			diagMove = true;
		}
		if (this.leftDownPressed()) {
			this.game.moveDiver(
				-diagMoveAmount,
				diagMoveAmount
			);
			diagMove = true;
		}
		if (this.rightDownPressed()) {
			this.game.moveDiver(
				diagMoveAmount,
				diagMoveAmount
			);
			diagMove = true;
		}

		if (!diagMove) {
			if (this.leftPressed()) {
				this.game.moveDiver(-moveAmount, 0);
				move = true;
			}
			if (this.rightPressed()) {
				this.game.moveDiver(moveAmount, 0);
				move = true;
			}

			if (this.upPressed()) {
				this.game.moveDiver(0, -moveAmount);
				move = true;
			}

			if (this.downPressed()) {
				this.game.moveDiver(0, moveAmount);
				move = true;
			}
		}

		if ((diagMove || move) && this.acceleration < 1) {
			this.acceleration += ACCELERATION_INCREMENT;
			if (this.acceleration > 1) this.acceleration = 1;
		} else if (!diagMove && !move) {
			this.acceleration = ACCELERATION_START;
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
