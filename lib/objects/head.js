import createjs from 'createjs';

import Segment, { LEFT } from './segment';
import { createHeadSpriteSheet } from '../ui/sprite_sheets';

const HEAD_SHEET = createHeadSpriteSheet();

class Head extends Segment {
  constructor(options) {
    const startFrame = options.direction === LEFT ? "moveLeft" : "moveRight";
    const headSprite = new createjs.Sprite(HEAD_SHEET, startFrame);

    super(options, headSprite);
  }

  static createHeadFromSegment(segment) {
      const head = new Head({
      x: segment.getX(),
      y: segment.getY(),
      direction: segment.direction,
      verticalDirection: segment.verticalDirection
    });
    if(segment.next) head.connectNext(segment.next);
    return head;
  }
}

export default Head;
