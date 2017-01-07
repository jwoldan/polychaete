import createjs from 'createjs';

import MovingObject, { UP } from './moving_object';

import {
  createSmallBubbleSpriteSheet,
  createMediumBubbleSpriteSheet,
  createLargeBubbleSpriteSheet,
} from '../ui/sprite_sheets';

export const BUBBLE_SMALL = 'BUBBLE_SMALL';
export const BUBBLE_MEDIUM = 'BUBBLE_MEDIUM';
export const BUBBLE_LARGE = 'BUBBLE_LARGE';

export const BUBBLE_SIZES = [
  BUBBLE_SMALL,
  BUBBLE_MEDIUM,
  BUBBLE_LARGE
];

const SMALL_BUBBLE_SHEET = createSmallBubbleSpriteSheet();
const MEDIUM_BUBBLE_SHEET = createMediumBubbleSpriteSheet();
const LARGE_BUBBLE_SHEET = createLargeBubbleSpriteSheet();

const BUBBLE_SHEETS = {
  [BUBBLE_SMALL]: SMALL_BUBBLE_SHEET,
  [BUBBLE_MEDIUM]: MEDIUM_BUBBLE_SHEET,
  [BUBBLE_LARGE]: LARGE_BUBBLE_SHEET,
};

const BUBBLE_DIAMETERS = {
  [BUBBLE_SMALL]: 16,
  [BUBBLE_MEDIUM]: 32,
  [BUBBLE_LARGE]: 64,
};

const BUBBLE_VELOCITIES = {
  [BUBBLE_SMALL]: -.5,
  [BUBBLE_MEDIUM]: -.75,
  [BUBBLE_LARGE]: -1,
};

class Bubble extends MovingObject {

  constructor(options) {
    const bubbleSize = options.bubbleSize || BUBBLE_SMALL;
    const bubbleSprite = new createjs.Sprite(
      BUBBLE_SHEETS[bubbleSize], 'default'
    );

    const defaultOptions = {
      x: 0,
      y: 0,
      width: BUBBLE_DIAMETERS[bubbleSize],
      height: BUBBLE_DIAMETERS[bubbleSize],
      direction: UP,
      velocityY: BUBBLE_VELOCITIES[bubbleSize],
      velocityX: .5,
      sprite: bubbleSprite,
    };

    super(Object.assign(defaultOptions, options));
  }

  updatePosition() {
    if (Math.random() <= .005) {
      this.velocityX = -this.velocityX;
    }
    MovingObject.prototype.updatePosition.call(this);
  }

}

export default Bubble;
