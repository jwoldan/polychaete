import createjs from 'createjs';

import { FPS } from './display/sprite_sheets';

import Game from './ui/game';
import KeyHandler from './ui/key_handler';
import Diver from './models/diver';
import Head from './models/head';
import Segment from './models/segment';
import SeaSponge from './models/sea_sponge';

document.addEventListener('DOMContentLoaded', () => {

  const stage = new createjs.Stage('canvas');

  const canvas = document.getElementById('canvas');
  const background = new createjs.Shape();
  background.graphics
    .beginFill('black')
    .drawRect(0, 0, canvas.width, canvas.height);
  stage.addChild(background);
  stage.update();

  const diver = new Diver({ stage });
  const head = new Head({ stage, x: 16 });
  const segment = new Segment({ stage, x: 0 });
  const sponge = new SeaSponge({ stage, x: 30 });

  const game = new Game({ stage, diver });
  game.addSegment(head);
  game.addSegment(segment);
  game.addSeaSponge(sponge);

  const keyHandler = new KeyHandler(game);
  keyHandler.attachListeners();

  createjs.Ticker.setFPS(FPS);
  createjs.Ticker.on("tick", stage);
  createjs.Ticker.on("tick", keyHandler.handleTick);
  createjs.Ticker.on("tick", game.updatePositions);
  createjs.Ticker.on("tick", game.checkCollisions);

});
