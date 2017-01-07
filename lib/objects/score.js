import createjs from 'createjs';

import MovingObject, { UP } from './moving_object';

import {
  createScore1SpriteSheet,
  createScore5SpriteSheet,
  createScore10SpriteSheet,
  createScore50SpriteSheet,
  createScore100SpriteSheet,
  createScore150SpriteSheet,
  createScore200SpriteSheet,
  createScore300SpriteSheet,
  createScore600SpriteSheet,
  createScore900SpriteSheet,
} from '../ui/score_sprite_sheets';

const SCORE_HEIGHT = 13;

const SCORE_SHEETS = {
  1: createScore1SpriteSheet(),
  5: createScore5SpriteSheet(),
  10: createScore10SpriteSheet(),
  50: createScore50SpriteSheet(),
  100: createScore100SpriteSheet(),
  150: createScore150SpriteSheet(),
  200: createScore200SpriteSheet(),
  300: createScore300SpriteSheet(),
  600: createScore600SpriteSheet(),
  900: createScore900SpriteSheet(),
};

class Score extends MovingObject {

  constructor(options) {
    const score = options.score || 1;
    const scoreSprite = new createjs.Sprite(SCORE_SHEETS[score], 'default');
    const width = Score.scoreWidth(score);

    const defaultOptions = {
      x: 0,
      y: 0,
      width,
      height: SCORE_HEIGHT,
      direction: UP,
      velocityY: -.25,
      sprite: scoreSprite,
    };

    super(Object.assign(defaultOptions, options));
    this.score = options.score;
  }

  getAlpha() {
    return this.sprite.alpha;
  }

  updatePosition() {
    MovingObject.prototype.updatePosition.call(this);
    this.sprite.alpha -= .025;
  }

  static createScoreAboveObject(gameObject, score) {
    const x = gameObject.getCenterX() - (Score.scoreWidth(score) / 2);
    const y = gameObject.getY() - (SCORE_HEIGHT + 4);
    return new Score({
      x,
      y,
      score,
    });
  }

  static scoreWidth(score) {
    let width = 8;
    if (score >= 10) width = 18;
    if (score >= 100) width = 28;
    return width;
  }
}

export default Score;
