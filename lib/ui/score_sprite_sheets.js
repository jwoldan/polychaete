import createjs from 'createjs';

import { ANIMATION_RATE } from './sprite_sheets';

export const createScore1SpriteSheet = (frameRate = ANIMATION_RATE) => (
  new createjs.SpriteSheet({
    frames: {
      width: 8,
      height: 13,
    },
    images: ['./assets/scores/1.png'],
    animations: {
      default: 0,
    },
    framerate: frameRate,
  })
);

export const createScore5SpriteSheet = (frameRate = ANIMATION_RATE) => (
  new createjs.SpriteSheet({
    frames: {
      width: 8,
      height: 13,
    },
    images: ['./assets/scores/5.png'],
    animations: {
      default: 0,
    },
    framerate: frameRate,
  })
);

export const createScore10SpriteSheet = (frameRate = ANIMATION_RATE) => (
  new createjs.SpriteSheet({
    frames: {
      width: 18,
      height: 13,
    },
    images: ['./assets/scores/10.png'],
    animations: {
      default: 0,
    },
    framerate: frameRate,
  })
);

export const createScore50SpriteSheet = (frameRate = ANIMATION_RATE) => (
  new createjs.SpriteSheet({
    frames: {
      width: 18,
      height: 13,
    },
    images: ['./assets/scores/50.png'],
    animations: {
      default: 0,
    },
    framerate: frameRate,
  })
);

export const createScore100SpriteSheet = (frameRate = ANIMATION_RATE) => (
  new createjs.SpriteSheet({
    frames: {
      width: 28,
      height: 13,
    },
    images: ['./assets/scores/100.png'],
    animations: {
      default: 0,
    },
    framerate: frameRate,
  })
);

export const createScore150SpriteSheet = (frameRate = ANIMATION_RATE) => (
  new createjs.SpriteSheet({
    frames: {
      width: 28,
      height: 13,
    },
    images: ['./assets/scores/150.png'],
    animations: {
      default: 0,
    },
    framerate: frameRate,
  })
);

export const createScore200SpriteSheet = (frameRate = ANIMATION_RATE) => (
  new createjs.SpriteSheet({
    frames: {
      width: 28,
      height: 13,
    },
    images: ['./assets/scores/200.png'],
    animations: {
      default: 0,
    },
    framerate: frameRate,
  })
);

export const createScore300SpriteSheet = (frameRate = ANIMATION_RATE) => (
  new createjs.SpriteSheet({
    frames: {
      width: 28,
      height: 13,
    },
    images: ['./assets/scores/300.png'],
    animations: {
      default: 0,
    },
    framerate: frameRate,
  })
);

export const createScore600SpriteSheet = (frameRate = ANIMATION_RATE) => (
  new createjs.SpriteSheet({
    frames: {
      width: 28,
      height: 13,
    },
    images: ['./assets/scores/600.png'],
    animations: {
      default: 0,
    },
    framerate: frameRate,
  })
);

export const createScore900SpriteSheet = (frameRate = ANIMATION_RATE) => (
  new createjs.SpriteSheet({
    frames: {
      width: 28,
      height: 13,
    },
    images: ['./assets/scores/900.png'],
    animations: {
      default: 0,
    },
    framerate: frameRate,
  })
);
