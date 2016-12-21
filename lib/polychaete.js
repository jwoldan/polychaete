import createjs from 'createjs';
import {
  createHeadSprite,
  createSegmentSprite,
  createSpongeSprite,
  createDiverSprite
} from './display/sprite_sheets';

const frameRate = 9;

document.addEventListener('DOMContentLoaded', () => {

  const stage = new createjs.Stage('canvas');

  var shape = new createjs.Shape();
  shape.graphics.beginFill('black').drawRect(0, 0, 500, 700);
  stage.addChild(shape);
  stage.update();

  const head = createHeadSprite(frameRate);
  const segment = createSegmentSprite(frameRate);
  const sponge = createSpongeSprite(frameRate);
  const diver = createDiverSprite(frameRate);

  const headSprite = new createjs.Sprite(head, "moveUp");
  stage.addChild(headSprite);

  const segmentSprite = new createjs.Sprite(segment, "moveUp");
  segmentSprite.x = 16;
  stage.addChild(segmentSprite);

  const spongeSpriteNew = new createjs.Sprite(sponge, "new");
  spongeSpriteNew.x = 32;
  stage.addChild(spongeSpriteNew);

  const spongeSpriteOneHit = new createjs.Sprite(sponge, "oneHit");
  spongeSpriteOneHit.x = 52;
  stage.addChild(spongeSpriteOneHit);

  const spongeSpriteTwoHits = new createjs.Sprite(sponge, "twoHits");
  spongeSpriteTwoHits.x = 72;
  stage.addChild(spongeSpriteTwoHits);

  const diverSprite = new createjs.Sprite(diver, "default");
  diverSprite.x = 90;
  stage.addChild(diverSprite);

  createjs.Ticker.on("tick", stage);

});
