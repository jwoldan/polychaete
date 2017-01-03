import GameObject from './game_object';

export const RIGHT = 'RIGHT';
export const LEFT = 'LEFT';
export const DOWN = 'DOWN';
export const UP = 'UP';

class MovingObject extends GameObject {

  constructor(options, moveBounds) {
    super(options, moveBounds);

    this.direction = options.direction || RIGHT;
    this.velocityX = options.velocityX || 0;
    this.velocityY = options.velocityY || 0;
  }

}

export default MovingObject;
