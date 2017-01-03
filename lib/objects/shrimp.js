import createjs from 'createjs';

import { getRandomInt } from '../util/util';

import MovingObject, { RIGHT, LEFT, DOWN, UP } from './moving_object';
import { createShrimpSpriteSheet } from '../ui/sprite_sheets';
import SeaSponge from './sea_sponge';

export const SHRIMP_MIN_VELOCITY = 6;

const SHRIMP_SHEET = createShrimpSpriteSheet();

class Shrimp extends MovingObject {

  constructor(options = {}) {
    const shrimpSprite = new createjs.Sprite(SHRIMP_SHEET);

    const defaultOptions = {
      x: 0,
      y: 0,
      width: 16,
      height: 20,
      sprite: shrimpSprite,
    };

    super(Object.assign(defaultOptions, options));
  }

  dropSeaSponge() {
    return new SeaSponge({ x: this.getX(), y: this.getY() });
  }
}

export default Shrimp;
