import createjs from 'createjs';

import MovingObject, { UP } from './moving_object';

import {
  createScore1SpriteSheet,
  createScore10SpriteSheet,
  createScore100SpriteSheet,
  createScore200SpriteSheet,
  createScore300SpriteSheet,
  createScore600SpriteSheet,
  createScore900SpriteSheet,
} from '../ui/score_sprite_sheets';

import {
  SPONGE_HIT_SCORE,
  HEAD_HIT_SCORE,
  SEGMENT_HIT_SCORE,
  CRAB_HIT_SCORE_CLOSE,
  CRAB_HIT_SCORE_MIDDLE,
  CRAB_HIT_SCORE_FAR,
  SHRIMP_HIT_SCORE,
} from '../ui/scores';

const SCORE_HEIGHT = 13;

const SCORE_1_SHEET = createScore1SpriteSheet();
const SCORE_10_SHEET = createScore10SpriteSheet();
const SCORE_100_SHEET = createScore100SpriteSheet();
const SCORE_200_SHEET = createScore200SpriteSheet();
const SCORE_300_SHEET = createScore300SpriteSheet();
const SCORE_600_SHEET = createScore600SpriteSheet();
const SCORE_900_SHEET = createScore900SpriteSheet();

const SCORE_SHEETS = {
[SPONGE_HIT_SCORE]: SCORE_1_SHEET,
  [HEAD_HIT_SCORE]: SCORE_100_SHEET,
  [SEGMENT_HIT_SCORE]: SCORE_10_SHEET,
  [CRAB_HIT_SCORE_CLOSE]: SCORE_300_SHEET,
  [CRAB_HIT_SCORE_MIDDLE]: SCORE_600_SHEET,
  [CRAB_HIT_SCORE_FAR]: SCORE_900_SHEET,
  [SHRIMP_HIT_SCORE]: SCORE_200_SHEET,
};

class Score extends MovingObject {

  constructor(options) {
    const score = options.score || SPONGE_HIT_SCORE;
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
