import createjs from 'createjs';

import MovingObject, { RIGHT, LEFT, DOWN, UP } from './moving_object';
import { createSegmentSpriteSheet } from '../ui/sprite_sheets';
import { DIVER_MIN_Y } from './diver';

const SEGMENT_SHEET = createSegmentSpriteSheet();

const VERTICAL_FROM_RIGHT = 'VERTICAL_FROM_RIGHT';
const VERTICAL_FROM_LEFT = 'VERTICAL_FROM_LEFT';

export const INITIAL_VELOCITY_X = 4;
const VELOCITY_Y = 10;

class Segment extends MovingObject {
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
      velocityX: INITIAL_VELOCITY_X,
      sprite: segmentSprite,
    };
    super(Object.assign(defaultOptions, options), moveBounds);

    this.verticalDirection = options.verticalDirection || DOWN;
    this.prev = null;
    this.next = null;
  }

  updatePosition(collided = false) {
    switch (this.direction) {
      case RIGHT:
        if (
          collided ||
          this.moveBounds.maxX - this.getMaxX() < this.velocityX ||
          (
            this.prev &&
            this.prev.direction === LEFT &&
            this.prev.getX() < (this.getX() - (this.getWidth() / 2)))
        ) {
          this.moveVerticalFromRight();
        } else {
          this.moveRight();
        }
        break;
      case LEFT:
        if (
          collided ||
          this.getX() - this.moveBounds.minX < this.velocityX ||
          (
            this.prev &&
            this.prev.direction === RIGHT &&
            this.prev.getX() > (this.getX() + (this.getWidth() / 2)))
        ) {
          this.moveVerticalFromLeft();
        } else {
          this.moveLeft();
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
      (this.moveBounds.maxY - this.getMaxY()) < VELOCITY_Y
    ) {
      this.verticalDirection = UP;
      this.moveBounds.minY = DIVER_MIN_Y;
    } else if (
      this.verticalDirection === UP &&
      (this.getY() - this.moveBounds.minY) < VELOCITY_Y
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
      this.sprite.gotoAndStop('moveDown');
    } else {
      vertChange = -VELOCITY_Y;
      this.sprite.gotoAndStop('moveUp');
    }
    this.changeX(this.velocityX);
    this.changeY(vertChange);
    this.direction = VERTICAL_FROM_RIGHT;
  }

  moveVerticalFromLeft() {
    let vertChange;
    if (this.verticalDirection === DOWN) {
      vertChange = VELOCITY_Y;
      this.sprite.gotoAndStop('moveDown');
    } else {
      vertChange = -VELOCITY_Y;
      this.sprite.gotoAndStop('moveUp');
    }
    this.changeX(-this.velocityX);
    this.changeY(vertChange);
    this.direction = VERTICAL_FROM_LEFT;
  }

  moveRightFromVertical() {
    if (this.prev && this.prev.direction === RIGHT) {
      this.setX(this.prev.getX() - this.getWidth());
      this.setY(this.prev.getY());
    } else {
      let x = this.getX() + this.velocityX;
      x = Math.ceil(x / this.getWidth()) * this.getWidth();
      this.setX(x);
      const vertChange =
        this.verticalDirection === DOWN ? VELOCITY_Y : -VELOCITY_Y;
      this.changeY(vertChange);
    }
    this.sprite.gotoAndPlay('moveRight');
    this.direction = RIGHT;
  }

  moveLeftFromVertical() {
    if (this.prev && this.prev.direction === LEFT) {
      this.setX(this.prev.getX() + this.prev.getWidth());
      this.setY(this.prev.getY());
    } else {
      let x = this.getX() - this.velocityX;
      x = Math.floor(x / this.getWidth()) * this.getWidth();
      this.setX(x);
      const vertChange =
        this.verticalDirection === DOWN ? VELOCITY_Y : -VELOCITY_Y;
      this.changeY(vertChange);
    }
    this.sprite.gotoAndPlay('moveLeft');
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

  overlapsSegment(segment) {
    const hDirs = new Set([LEFT, RIGHT]);
    if (!hDirs.has(this.direction) || !hDirs.has(segment.direction)) {
      return false;
    }
    return MovingObject.prototype.overlaps.call(this, segment);
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
