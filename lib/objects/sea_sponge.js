import createjs from 'createjs';

import GameObject from './game_object';
import { createSeaSpongeSpriteSheet } from '../display/sprite_sheets';

const SEA_SPONGE_SHEET = createSeaSpongeSpriteSheet();

class SeaSponge extends GameObject {
  constructor(options) {
    const seaSpongeSprite = new createjs.Sprite(SEA_SPONGE_SHEET);

    const defaultOptions = {
      x: 0,
      y: 0,
      width: 16,
      height: 20,
      sprite: seaSpongeSprite,
    };
    super(Object.assign(defaultOptions, options));

    this.hits = 3;
  }

  handleHit() {
    this.hits -= 1;

    switch (this.hits) {
      case 2:
        this.sprite.gotoAndStop("oneHit");
        break;
      case 1:
        this.sprite.gotoAndStop("twoHits");
        break;
    }
  }
}

export default SeaSponge;
