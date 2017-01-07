import createjs from 'createjs';

import { getRandomInt } from '../util/util';

import MovingObject, { RIGHT, LEFT, DOWN, UP } from './moving_object';
import { createCrabSpriteSheet } from '../ui/sprite_sheets';
import { DIVER_MIN_Y } from './diver';

const CRAB_SHEET = createCrabSpriteSheet();

export const CRAB_MIN_VELOCITY = 4;

class Crab extends MovingObject {
  constructor(options = {}) {
    const crabSprite = new createjs.Sprite(CRAB_SHEET);

    const defaultOptions = {
      x: 0,
      y: 0,
      width: 25,
      height: 15,
      sprite: crabSprite,
    };

    super(Object.assign(defaultOptions, options));

    this.maxVelocity = options.maxVelocity || CRAB_MIN_VELOCITY;
    this.decisionPointX = this.getX();
    this.decisionPointY = this.getY();
  }

  updatePosition() {
    if (Math.abs(this.decisionPointX - this.getX()) <= Math.abs(this.velocityX)
        &&
        Math.abs(this.decisionPointY - this.getY()) <= Math.abs(this.velocityY)
        ) {
      this.updateDecisionPoint();
      this.updateVelocities();
    }
    this.changeX(this.velocityX);
    this.changeY(this.velocityY);
  }

  updateDecisionPoint() {
    const decisionXDelta = CRAB_MIN_VELOCITY * getRandomInt(10, 30);
    if (this.direction === LEFT) {
      this.decisionPointX = this.getX() - decisionXDelta;
    } else {
      this.decisionPointX = this.getX() + decisionXDelta;
    }

    if (this.decisionPointY < DIVER_MIN_Y) {
      this.decisionPointY =
        DIVER_MIN_Y + (CRAB_MIN_VELOCITY * getRandomInt(1, 50));
      if (this.decisionPointY > this.moveBounds.maxY) {
        this.decisionPointY = this.moveBounds.maxY - this.getHeight();
      }
    } else {
      this.decisionPointY =
        DIVER_MIN_Y - (CRAB_MIN_VELOCITY * getRandomInt(20, 50));
    }
  }

  updateVelocities() {
    const diffX = this.decisionPointX - this.getX();
    const diffY = this.decisionPointY - this.getY();
    const totalDelta = Math.sqrt((diffX * diffX) + (diffY * diffY));

    const velocity = getRandomInt(CRAB_MIN_VELOCITY, this.maxVelocity);
    this.velocityX = diffX / totalDelta * velocity;
    this.velocityY = diffY / totalDelta * velocity;
  }
}

export default Crab;
