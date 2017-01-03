import createjs from 'createjs';

import GameObject from './game_object';
import { createSeaSpongeSpriteSheet } from '../ui/sprite_sheets';

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

    this.hits = 4;
  }

  handleHit() {
    this.hits -= 1;

    switch (this.hits) {
      case 3:
        this.sprite.gotoAndStop("oneHit");
        break;
      case 2:
        this.sprite.gotoAndStop("twoHits");
        break;
      case 1:
        this.sprite.gotoAndStop("threeHits");
        break;
    }
  }
}

export default SeaSponge;
