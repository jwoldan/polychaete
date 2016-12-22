import createjs from 'createjs';

import {
  createHeadSpriteSheet,
  createSegmentSpriteSheet,
  createSpongeSpriteSheet,
  createDiverSpriteSheet,
} from './display/sprite_sheets';

const frameRate = 9;

document.addEventListener('DOMContentLoaded', () => {

  const stage = new createjs.Stage('canvas');

  var shape = new createjs.Shape();
  shape.graphics.beginFill('black').drawRect(0, 0, 500, 700);
  stage.addChild(shape);
  stage.update();

  const headSheet = createHeadSpriteSheet(frameRate);
  const segmentSheet = createSegmentSpriteSheet(frameRate);
  const spongeSheet = createSpongeSpriteSheet(frameRate);
  const diverSheet = createDiverSpriteSheet(frameRate);

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

  const diverSprite = new createjs.Sprite(diverSheet, "default");
  stage.addChild(diverSprite);

  createjs.Ticker.on("tick", stage);

});
