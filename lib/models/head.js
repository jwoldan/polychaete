import createjs from 'createjs';

import Segment from './segment';
import { createHeadSpriteSheet, ANIMATION_RATE }
  from '../display/sprite_sheets';

const HEAD_SHEET = createHeadSpriteSheet(ANIMATION_RATE);

class Head extends Segment {
  constructor(options) {
    const headSprite = new createjs.Sprite(HEAD_SHEET, "moveRight");

    super(options, headSprite);
  }
}

export default Head;
