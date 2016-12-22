import createjs from 'createjs';

import {
  createHeadSpriteSheet,
  createSegmentSpriteSheet,
  createSpongeSpriteSheet,
  FPS,
  ANIMATION_RATE,
} from './display/sprite_sheets';

import Game from './ui/game';
import KeyHandler from './ui/key_handler';
import Diver from './models/diver';

document.addEventListener('DOMContentLoaded', () => {

  const stage = new createjs.Stage('canvas');

  const canvas = document.getElementById('canvas');
  const background = new createjs.Shape();
  background.graphics
    .beginFill('black')
    .drawRect(0, 0, canvas.width, canvas.height);
  stage.addChild(background);
  stage.update();

  const headSheet = createHeadSpriteSheet(ANIMATION_RATE);
  const segmentSheet = createSegmentSpriteSheet(ANIMATION_RATE);
  const spongeSheet = createSpongeSpriteSheet(ANIMATION_RATE);


  const headSprite = new createjs.Sprite(headSheet, "moveUp");
  stage.addChild(headSprite);

  const segmentSprite = new createjs.Sprite(segmentSheet, "moveUp");
  segmentSprite.x = 16;
  stage.addChild(segmentSprite);

  const spongeSpriteNew = new createjs.Sprite(spongeSheet, "new");
  spongeSpriteNew.x = 32;
  stage.addChild(spongeSpriteNew);

  const spongeSpriteOneHit = new createjs.Sprite(spongeSheet, "oneHit");
  spongeSpriteOneHit.x = 48;
  stage.addChild(spongeSpriteOneHit);

  const spongeSpriteTwoHits = new createjs.Sprite(spongeSheet, "twoHits");
  spongeSpriteTwoHits.x = 64;
  stage.addChild(spongeSpriteTwoHits);

  const diver = new Diver({ stage });

  const game = new Game({ diver });

  const keyHandler = new KeyHandler(game);
  keyHandler.attachListeners();

  createjs.Ticker.setFPS(FPS);
  createjs.Ticker.on("tick", stage);
  createjs.Ticker.on("tick", keyHandler.handleTick);

  // TODO Remove after testing!
  window.stage = stage;

});
