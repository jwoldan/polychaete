import createjs from 'createjs';

import GameObject from './game_object';
import { createSegmentSpriteSheet, ANIMATION_RATE }
  from '../display/sprite_sheets';

const SEGMENT_SHEET = createSegmentSpriteSheet(ANIMATION_RATE);

class Segment extends GameObject {
  constructor(options, alternateSprite) {
    const segmentSprite = alternateSprite ?
      alternateSprite :
      new createjs.Sprite(SEGMENT_SHEET, "moveRight");

    const defaultOptions = {
      x: 0,
      y: 0,
      width: 16,
      height: 20,
      sprite: segmentSprite,
    };
    super(Object.assign(defaultOptions, options));
  }
}

export default Segment;
