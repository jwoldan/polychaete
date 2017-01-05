import createjs from 'createjs';

import { distance } from '../util/util';

import GameObject from './game_object';
import { createExplosionSpriteSheet } from '../ui/sprite_sheets';

const EXPLOSION_SHEET = createExplosionSpriteSheet();

export const EXPLOSION_RADIUS = 56;

class Explosion extends GameObject {

  constructor(options) {
    const explosionSprite = new createjs.Sprite(EXPLOSION_SHEET, 'default');

    const defaultOptions = {
      x: 0,
      y: 0,
      width: EXPLOSION_RADIUS * 2,
      height: EXPLOSION_RADIUS * 2,
      sprite: explosionSprite,
    };

    super(Object.assign(defaultOptions, options));

    this.ticks = 20;
  }

  tickDown() {
    if (this.ticks > 0) this.ticks -= 1;
  }

  overlaps(gameObject) {
    return (
      this.pointInRadius(gameObject.getX(), gameObject.getY()) ||
      this.pointInRadius(gameObject.getX(), gameObject.getMaxY()) ||
      this.pointInRadius(gameObject.getMaxX(), gameObject.getY()) ||
      this.pointInRadius(gameObject.getMaxX(), gameObject.getMaxY())
    );
  }

  pointInRadius(x, y) {
    return (
      distance(this.getCenterX(), this.getCenterY(), x, y) <=
      EXPLOSION_RADIUS
    );
  }
}

export default Explosion;
