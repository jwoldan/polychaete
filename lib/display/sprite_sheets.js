import createjs from 'createjs';

export const createDiverSprite = (frameRate) => (
  new createjs.SpriteSheet({
    frames: {
      width: 16,
      height: 18,
    },
    images: ['./assets/diver.png'],
    animations: {
      default: 0
    }
  })
);

export const createHeadSprite = (frameRate) => (
  new createjs.SpriteSheet({
    frames: [
      // move left
      [0, 0, 16, 20],
      [16, 0, 16, 20],
      [32, 0, 16, 20],
      // move right
      [0, 20, 16, 20],
      [16, 20, 16, 20],
      [32, 20, 16, 20],
      // move down
      [0, 40, 20, 20],
      [20, 40, 20, 20],
      [40, 40, 20, 20],
      // move up
      [0, 60, 20, 20],
      [20, 60, 20, 20],
      [40, 60, 20, 20],
    ],
    images: ['./assets/head.png'],
    animations: {
      moveLeft: [0, 2],
      moveRight: [3, 5],
      moveDown: [6, 8],
      moveUp: [9, 11],
    },
    framerate: frameRate,
  })
);

export const createSegmentSprite = (frameRate) => (
  new createjs.SpriteSheet({
    frames: [
      // left/right
      [0, 0, 16, 20],
      [16, 0, 16, 20],
      [32, 0, 16, 20],
      // up/down
      [0, 20, 20, 20],
      [20, 20, 20, 20],
      [40, 20, 20, 20],
    ],
    images: ['./assets/segment.png'],
    animations: {
      moveLeft: [0, 2],
      moveDown: [3, 5],
      moveRight: {
        frames: [2, 1, 0],
      },
      moveUp: {
        frames: [5, 4, 3],
      },
    },
    framerate: frameRate,
  })
);

export const createSpongeSprite = (frameRate) => (
  new createjs.SpriteSheet({
    frames: {
      width: 16,
      height: 20,
    },
    images: ['./assets/sea_sponge.png'],
    animations: {
      new: 0,
      oneHit: 1,
      twoHits: 2,
    },
    framerate: frameRate,
  })
);
