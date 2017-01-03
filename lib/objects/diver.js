import createjs from 'createjs';

import GameObject from './game_object';
import { createDiverSpriteSheet } from '../ui/sprite_sheets';
import LaserBeam, { BEAM_HEIGHT, BEAM_WIDTH } from './laser_beam';

export const DIVER_MOVE_AMOUNT = 3;

const DIVER_SHEET = createDiverSpriteSheet();

export const DIVER_MIN_Y = 520;

class Diver extends GameObject {

  constructor(options) {
    const diverSprite = new createjs.Sprite(DIVER_SHEET);

    const defaultOptions = {
      x: 200,
      y: 580,
      width: 16,
      height: 18,
      sprite: diverSprite,
    };
    super(
      Object.assign(defaultOptions, options),
      { minY: DIVER_MIN_Y }
    );
  }

  fireLaser() {
    const laserBeam = new LaserBeam({
      x: this.centerX() - BEAM_WIDTH / 2,
      y: this.getY() - BEAM_HEIGHT,
    });
    return laserBeam;
  }

}

export default Diver;
