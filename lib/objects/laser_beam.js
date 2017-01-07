import createjs from 'createjs';

import MovingObject from './moving_object';
import { createLaserBeamSpriteSheet } from '../ui/sprite_sheets';

const VELOCITY_Y = -16;
export const BEAM_WIDTH = 4;
export const BEAM_HEIGHT = 16;

const LASER_BEAM_SHEET = createLaserBeamSpriteSheet();

class LaserBeam extends MovingObject {

  constructor(options) {
    const laserBeamSprite = new createjs.Sprite(LASER_BEAM_SHEET);

    const defaultOptions = {
      width: BEAM_WIDTH,
      height: BEAM_HEIGHT,
      sprite: laserBeamSprite,
      velocityY: VELOCITY_Y,
    };

    super(
      Object.assign(defaultOptions, options)
    );
  }

}

export default LaserBeam;
