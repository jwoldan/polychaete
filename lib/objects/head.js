import createjs from 'createjs';

import Segment from './segment';
import { createHeadSpriteSheet } from '../ui/sprite_sheets';

const HEAD_SHEET = createHeadSpriteSheet();

class Head extends Segment {
  constructor(options) {
    const headSprite = new createjs.Sprite(HEAD_SHEET, "moveRight");

    super(options, headSprite);
  }
}

export default Head;
