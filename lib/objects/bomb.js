import createjs from 'createjs';

import GameObject from './game_object';
import { createBombSpriteSheet } from '../ui/sprite_sheets';
import Explosion, { EXPLOSION_RADIUS } from './explosion';

const BOMB_SHEET = createBombSpriteSheet();

class Bomb extends GameObject {

  constructor(options) {
    const bombSprite = new createjs.Sprite(BOMB_SHEET, 'default');

    const defaultOptions = {
      x: 0,
      y: 0,
      sprite: bombSprite,
    };
    super(Object.assign(defaultOptions, options));

    this.ticks = 30;
  }

  tickDown() {
    if (this.ticks > 0) this.ticks -= 1;
  }

  explode() {
    const explosion = new Explosion({
      x: this.centerX() - (EXPLOSION_RADIUS / 2),
      y: this.centerY() - (EXPLOSION_RADIUS / 2),
    });
    return explosion;
  }
}

export default Bomb;
