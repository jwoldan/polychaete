import createjs from 'createjs';

import GameObject from './game_object';
import { createExplosionSpriteSheet } from '../ui/sprite_sheets';

const EXPLOSION_SHEET = createExplosionSpriteSheet();

export const EXPLOSION_RADIUS = 112;

class Explosion extends GameObject {

  constructor(options) {
    const explosionSprite = new createjs.Sprite(EXPLOSION_SHEET, 'default');

    const defaultOptions = {
      x: 0,
      y: 0,
      sprite: explosionSprite,
    };

    super(Object.assign(defaultOptions, options));

    this.ticks = 20;
  }

  tickDown() {
    if (this.ticks > 0) this.ticks -= 1;
  }
}

export default Explosion;
