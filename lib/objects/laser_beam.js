import createjs from 'createjs';

import GameObject from './game_object';
import { createLaserBeamSpriteSheet } from '../ui/sprite_sheets';

const VELOCITY_Y = -8;
const LASER_BEAM_SHEET = createLaserBeamSpriteSheet();

class LaserBeam extends GameObject {

  constructor(options) {
    const laserBeamSprite = new createjs.Sprite(LASER_BEAM_SHEET);

    const defaultOptions = {
      width: 2,
      height: 12,
      sprite: laserBeamSprite,
    };

    super(
      Object.assign(defaultOptions, options)
    );
  }

  updatePosition() {
    this.changeY(-16);
  }

}

export default LaserBeam;
