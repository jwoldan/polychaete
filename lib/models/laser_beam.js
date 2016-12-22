import createjs from 'createjs';

import GameObject from './game_object';
import { createLaserBeamSpriteSheet, ANIMATION_RATE }
  from '../display/sprite_sheets';

const VELOCITY_Y = -8;
const LASER_BEAM_SHEET = createLaserBeamSpriteSheet(ANIMATION_RATE);

class LaserBeam extends GameObject {

  constructor(x, y, options) {
    const laserBeamSprite = new createjs.Sprite(LASER_BEAM_SHEET);
    laserBeamSprite.x = x;
    laserBeamSprite.y = y;

    const defaultOptions = {
      width: 2,
      height: 12,
      sprite: laserBeamSprite,
    };

    super(
      Object.assign(defaultOptions, options)
    );

    this.stage.addChild(laserBeamSprite);
    this.updatePosition = this.updatePosition.bind(this);
    createjs.Ticker.on("tick", this.updatePosition);
  }

  updatePosition() {
    this.changeY(-8);
  }

}

export default LaserBeam;
