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

const SCORE_1_SHEET = createScore1SpriteSheet();
const SCORE_5_SHEET = createScore5SpriteSheet();
const SCORE_10_SHEET = createScore10SpriteSheet();
const SCORE_50_SHEET = createScore50SpriteSheet();
const SCORE_100_SHEET = createScore100SpriteSheet();
const SCORE_150_SHEET = createScore150SpriteSheet();
const SCORE_200_SHEET = createScore200SpriteSheet();
const SCORE_300_SHEET = createScore300SpriteSheet();
const SCORE_600_SHEET = createScore600SpriteSheet();
const SCORE_900_SHEET = createScore900SpriteSheet();

const SCORE_SHEETS = {
  1: SCORE_1_SHEET,
  5: SCORE_5_SHEET,
  10: SCORE_10_SHEET,
  50: SCORE_50_SHEET,
  100: SCORE_100_SHEET,
  150: SCORE_150_SHEET,
  200: SCORE_200_SHEET,
  300: SCORE_300_SHEET,
  600: SCORE_600_SHEET,
  900: SCORE_900_SHEET,
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
      velocityY: .1,
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
