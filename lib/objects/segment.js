import createjs from 'createjs';

import GameObject from './game_object';
import { createSegmentSpriteSheet } from '../ui/sprite_sheets';

const SEGMENT_SHEET = createSegmentSpriteSheet();


export const RIGHT = 'RIGHT';
export const LEFT = 'LEFT';
const DOWN = 'DOWN';
const UP = 'UP';
const VERTICAL_FROM_RIGHT = 'VERTICAL_FROM_RIGHT';
const VERTICAL_FROM_LEFT = 'VERTICAL_FROM_LEFT';

export const INITIAL_VELOCITY_X = 4;
const VELOCITY_Y = 10;

class Segment extends GameObject {
  constructor(options, moveBounds, alternateSprite) {

    let segmentSprite;
    if (alternateSprite) {
      segmentSprite = alternateSprite;
    } else {
      const startFrame = options.direction === LEFT ? "moveLeft" : "moveRight";
      segmentSprite = alternateSprite ?
        alternateSprite :
        new createjs.Sprite(SEGMENT_SHEET, startFrame);
    }

    const defaultOptions = {
      x: 0,
      y: 0,
      width: 16,
      height: 20,
      sprite: segmentSprite,
    };
    super(Object.assign(defaultOptions, options), moveBounds);

    this.direction = options.direction || RIGHT;
    this.verticalDirection = options.verticalDirection || DOWN;
    this.velocityX = options.velocityX || INITIAL_VELOCITY_X;

    this.prev = null;
    this.next = null;
  }

  updatePosition(collided = false) {
    switch (this.direction) {
      case RIGHT:
        if ((this.moveBounds.maxX - this.getMaxX()) > this.velocityX &&
            !collided) {
          this.moveRight();
        } else {
          this.moveVerticalFromRight();
        }
        break;
      case LEFT:
        if ((this.getX() - this.moveBounds.minX) > this.velocityX &&
            !collided) {
          this.moveLeft();
        } else {
          this.moveVerticalFromLeft();
        }
        break;
      case VERTICAL_FROM_RIGHT:
        this.moveLeftFromVertical();
        break;
      case VERTICAL_FROM_LEFT:
        this.moveRightFromVertical();
        break;
    }
    if (
      this.verticalDirection === DOWN &&
      (this.moveBounds.maxY - this.getMaxY()) < 10
    ) {
      this.verticalDirection = UP;
      this.moveBounds.minY = 520;
    } else if (
      this.verticalDirection === UP &&
      (this.getY() - this.moveBounds.minY) < 10
    ) {
      this.verticalDirection = DOWN;
    }
  }

  moveRight() {
    this.changeX(this.velocityX);
    this.direction = RIGHT;
  }

  moveLeft() {
    this.changeX(-this.velocityX);
    this.direction = LEFT;
  }

  moveVerticalFromRight() {
    let vertChange;
    if (this.verticalDirection === DOWN) {
      vertChange = VELOCITY_Y;
      this.sprite.gotoAndPlay('moveDown');
    } else {
      vertChange = -VELOCITY_Y;
      this.sprite.gotoAndPlay('moveUp');
    }
    this.changeX(this.velocityX);
    this.changeY(vertChange);
    this.direction = VERTICAL_FROM_RIGHT;
  }

  moveVerticalFromLeft() {
    let vertChange;
    if (this.verticalDirection === DOWN) {
      vertChange = VELOCITY_Y;
      this.sprite.gotoAndPlay('moveDown');
    } else {
      vertChange = -VELOCITY_Y;
      this.sprite.gotoAndPlay('moveUp');
    }
    this.changeX(-this.velocityX);
    this.changeY(vertChange);
    this.direction = VERTICAL_FROM_LEFT;
  }

  moveRightFromVertical() {
    if (this.prev) {
      this.setX(this.prev.getX() - this.getWidth());
    } else {
      this.changeX(this.velocityX);
    }
    const vertChange =
      this.verticalDirection === DOWN ? VELOCITY_Y : -VELOCITY_Y;
    this.sprite.gotoAndPlay('moveRight');
    this.changeY(vertChange);
    this.direction = RIGHT;
  }

  moveLeftFromVertical() {
    if (this.prev) {
      this.setX(this.prev.getX() + this.prev.getWidth());
    } else {
      this.changeX(-this.velocityX);
    }
    const vertChange =
      this.verticalDirection === DOWN ? VELOCITY_Y : -VELOCITY_Y;
    this.sprite.gotoAndPlay('moveLeft');
    this.changeY(vertChange);
    this.direction = LEFT;
  }

  connectNext(segment) {
    const oldNext = this.next;
    this.next = segment;
    if (segment.prev) segment.prev.next = null;
    segment.prev = this;
    if (oldNext) {
      oldNext.prev = segment;
      segment.next = oldNext;
    }
  }

  destroy() {
    if (this.next) this.next.prev = null;
    if (this.prev) this.prev.next = null;
    this.next = null;
    this.prev = null;
    this.destroySprite();
  }
}

export default Segment;
