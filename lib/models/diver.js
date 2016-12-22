import createjs from 'createjs';

import GameObject from './game_object';
import { createDiverSpriteSheet, ANIMATION_RATE }
  from '../display/sprite_sheets';
import LaserBeam from './laser_beam';

const DIVER_SHEET = createDiverSpriteSheet(ANIMATION_RATE);

class Diver extends GameObject {

  constructor(options) {
    const diverSprite = new createjs.Sprite(DIVER_SHEET);
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

    this.stage.addChild(diverSprite);
  }

  fireLaser() {
    const laserBeam = new LaserBeam(
      this.centerX() - 1,
      this.getY() - 12,
      { stage: this.stage }
    );
  }

}

export default Diver;
