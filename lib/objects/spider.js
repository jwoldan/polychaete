import createjs from 'createjs';

import GameObject from './game_object';
import { createSpiderSpriteSheet } from '../ui/sprite_sheets';

const SPIDER_SHEET = createSpiderSpriteSheet();

class Spider extends GameObject {
  constructor(options) {
    const spiderSprite = new createjs.Sprite(SPIDER_SHEET);

    const defaultOptions = {
      x: 0,
      y: 0,
      width: 25,
      height: 15,
      sprite: spiderSprite,
    };

    super(Object.assign(defaultOptions, options));
  }
}

export default Spider;
