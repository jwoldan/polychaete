import createjs from 'createjs';

import GameObject from './game_object';
import { createDiverSpriteSheet, ANIMATION_RATE }
  from '../display/sprite_sheets';

const diverSheet = createDiverSpriteSheet(ANIMATION_RATE);

class Diver extends GameObject {

  constructor(options) {
    const diverSprite = new createjs.Sprite(diverSheet);
    diverSprite.x = 232;
    diverSprite.y = 700;

    const defaultOptions = {
      width: 16,
      height: 18,
      sprite: diverSprite,
    };
    super(
      Object.assign(defaultOptions, options),
      { minY: 600 }
    );
  }

}

export default Diver;
