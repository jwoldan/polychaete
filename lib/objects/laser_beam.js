import createjs from 'createjs';

import GameObject from './game_object';
import { createLaserBeamSpriteSheet } from '../ui/sprite_sheets';

const VELOCITY_Y = -16;
export const BEAM_WIDTH = 2;
export const BEAM_HEIGHT = 12;

const LASER_BEAM_SHEET = createLaserBeamSpriteSheet();

class LaserBeam extends GameObject {

  constructor(options) {
    const laserBeamSprite = new createjs.Sprite(LASER_BEAM_SHEET);

    const defaultOptions = {
      width: BEAM_WIDTH,
      height: BEAM_HEIGHT,
      sprite: laserBeamSprite,
    };

    super(
      Object.assign(defaultOptions, options)
    );
  }

  updatePosition() {
    this.changeY(VELOCITY_Y);
  }

}

export default LaserBeam;
