import createjs from 'createjs';

import Segment, { LEFT } from './segment';
import { createHeadSpriteSheet } from '../ui/sprite_sheets';

const HEAD_SHEET = createHeadSpriteSheet();

class Head extends Segment {
  constructor(options, moveBounds) {
    const startFrame = options.direction === LEFT ? "moveLeft" : "moveRight";
    const headSprite = new createjs.Sprite(HEAD_SHEET, startFrame);

    super(options, moveBounds, headSprite);
  }

  static createHeadFromSegment(segment) {
      const head = new Head({
      x: segment.getX(),
      y: segment.getY(),
      direction: segment.direction,
      verticalDirection: segment.verticalDirection,
      velocityX: segment.velocityX,
    }, Object.assign({}, segment.moveBounds));
    if(segment.next) head.connectNext(segment.next);
    return head;
  }
}

export default Head;
