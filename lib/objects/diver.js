import createjs from 'createjs';

import GameObject from './game_object';
import { createDiverSpriteSheet } from '../ui/sprite_sheets';
import LaserBeam from './laser_beam';

const DIVER_SHEET = createDiverSpriteSheet();

class Diver extends GameObject {

  constructor(options) {
    const diverSprite = new createjs.Sprite(DIVER_SHEET);

    const defaultOptions = {
      x: 232,
      y: 700,
      width: 16,
      height: 18,
      sprite: diverSprite,
    };
    super(
      Object.assign(defaultOptions, options),
      { minY: 600 }
    );
  }

  fireLaser() {
    const laserBeam = new LaserBeam({
      x: this.centerX() - 1,
      y: this.getY() - 12,
    });
    return laserBeam;
  }

}

export default Diver;
