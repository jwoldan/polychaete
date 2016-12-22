import createjs from 'createjs';

import {
  createSpongeSpriteSheet,
  FPS,
  ANIMATION_RATE,
} from './display/sprite_sheets';

import Game from './ui/game';
import KeyHandler from './ui/key_handler';
import Diver from './models/diver';
import Head from './models/head';
import Segment from './models/segment';

document.addEventListener('DOMContentLoaded', () => {

  const stage = new createjs.Stage('canvas');

  const canvas = document.getElementById('canvas');
  const background = new createjs.Shape();
  background.graphics
    .beginFill('black')
    .drawRect(0, 0, canvas.width, canvas.height);
  stage.addChild(background);
  stage.update();

  const spongeSheet = createSpongeSpriteSheet(ANIMATION_RATE);
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
  const head = new Head({ stage, x: 16 });
  const segment = new Segment({ stage, x: 0 });


  const game = new Game({ stage, diver });
  game.addSegment(head);
  game.addSegment(segment);

  const keyHandler = new KeyHandler(game);
  keyHandler.attachListeners();

  createjs.Ticker.setFPS(FPS);
  createjs.Ticker.on("tick", stage);
  createjs.Ticker.on("tick", keyHandler.handleTick);
  createjs.Ticker.on("tick", game.updatePositions);
  createjs.Ticker.on("tick", game.checkCollisions);

});
