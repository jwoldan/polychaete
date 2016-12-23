import createjs from 'createjs';

import GameObject from './game_object';
import { createSegmentSpriteSheet } from '../display/sprite_sheets';

const SEGMENT_SHEET = createSegmentSpriteSheet();


const RIGHT = 'RIGHT';
const LEFT = 'LEFT';
const DOWN_FROM_RIGHT = 'DOWN_FROM_RIGHT';
const DOWN_FROM_LEFT = 'DOWN_FROM_LEFT';

const VELOCITY_X = 8;
const VELOCITY_Y = 10;

class Segment extends GameObject {
  constructor(options, alternateSprite) {
    const segmentSprite = alternateSprite ?
      alternateSprite :
      new createjs.Sprite(SEGMENT_SHEET, "moveRight");

    const defaultOptions = {
      x: 0,
      y: 0,
      width: 16,
      height: 20,
      sprite: segmentSprite,
    };
    super(Object.assign(defaultOptions, options));

    this.direction = RIGHT;

    this.prev = null;
    this.next = null;
  }

  updatePosition(collided = false) {
    switch (this.direction) {
      case RIGHT:
        if ((this.moveBounds.maxX - this.getMaxX()) >= 16 && !collided) {
          this.moveRight();
        } else {
          this.moveDownFromRight();
        }
        break;
      case LEFT:
        if ((this.getX() - this.moveBounds.minX) >= 16 && !collided) {
          this.moveLeft();
        } else {
          this.moveDownFromLeft();
        }
        break;
      case DOWN_FROM_RIGHT:
        this.moveLeftFromDown();
        break;
      case DOWN_FROM_LEFT:
        this.moveRightFromDown();
        break;
    }
  }

  moveRight() {
    this.changeX(VELOCITY_X);
    this.direction = RIGHT;
  }

  moveLeft() {
    this.changeX(-VELOCITY_X);
    this.direction = LEFT;
  }

  moveDownFromRight() {
    this.sprite.gotoAndPlay('moveDown');
    this.changeX(VELOCITY_X * 1.5);
    this.changeY(VELOCITY_Y);
    this.direction = DOWN_FROM_RIGHT;
  }

  moveDownFromLeft() {
    this.sprite.gotoAndPlay('moveDown');
    this.changeX(-VELOCITY_X * 1.5);
    this.changeY(VELOCITY_Y);
    this.direction = DOWN_FROM_LEFT;
  }

  moveRightFromDown() {
    this.sprite.gotoAndPlay('moveRight');
    this.changeX(VELOCITY_X * 1.5);
    this.changeY(VELOCITY_Y);
    this.direction = RIGHT;
  }

  moveLeftFromDown() {
    this.sprite.gotoAndPlay('moveLeft');
    this.changeX(-VELOCITY_X * 1.5);
    this.changeY(VELOCITY_Y);
    this.direction = LEFT;
  }

  connectNext(segment) {
    const oldNext = this.next;
    this.next = segment;
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
