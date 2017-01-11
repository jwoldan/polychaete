import createjs from 'createjs';

import { FPS } from '../ui/sprite_sheets';

import { getRandomInt } from '../util/util';

import Bubble, { BUBBLE_SIZES } from '../objects/bubble';
import Diver from '../objects/diver';
import Head from '../objects/head';
import Segment from '../objects/segment';
import { LEFT, RIGHT } from '../objects/moving_object';
import SeaSponge from '../objects/sea_sponge';
import Crab from '../objects/crab';
import Shrimp from '../objects/shrimp';

class Board {

  constructor(options) {
    this.stage = options.stage;

    this.bubbles = [];
    this.laserBeams = [];
    this.bombs = [];
    this.explosions = [];
    this.segments = [];
    this.sponges = [];
    this.shrimp = [];
    this.crab = null;
    this.scores = [];

    this.setBackground();
  }

  reset() {
    this.removeDiver();
    this.removeAllLaserBeams();
    this.removeAllBombs();
    this.removeAllExplosions();
    this.removeAllSeaSponges();
    this.removeAllSegments();
    this.removeAllShrimp();
    this.removeCrab();
    this.removeAllScores();
  }

  addDiver() {
    this.diver = new Diver();
    this.diver.setStage(this.stage);
    this.stage.addChild(this.diver.sprite);
  }

  removeDiver() {
    if (this.diver) {
      this.stage.removeChild(this.diver.sprite);
      this.diver.destroy();
      this.diver = null;
    }
  }

  setBackground() {
    const background = new createjs.Shape();
    background.graphics
      .beginFill('#002e9a')
      .drawRect(0, 0, this.stage.canvas.width, this.stage.canvas.height);
    this.stage.addChild(background);
    this.stage.setChildIndex(background, 0);
    this.stage.update();
  }

  addBubbles(numBubbles) {
    let bubblesPlaced = 0;

    while(bubblesPlaced < numBubbles) {
      const x = this.stage.canvas.width * Math.random();
      const y = this.stage.canvas.height * Math.random();
      const bubbleSize = BUBBLE_SIZES[Math.floor(Math.random() * 3)];
      const bubble = new Bubble({ x, y, bubbleSize });
      this.addBubble(bubble);
      bubblesPlaced++;
    }
  }

  addSeaSponges(numSponges) {
    let spongesPlaced = 0;

    while(spongesPlaced < numSponges) {
      const x = 16 * getRandomInt(0, 25);
      const y = 20 * getRandomInt(1, 25);

      let collision = false;
      this.sponges.forEach((sponge) => {
        if (sponge.getX() === x && sponge.getY() === y) {
          collision = true;
        }
      });

      if (!collision) {
        const sponge = new SeaSponge({ x, y });
        this.addSeaSponge(sponge);
        spongesPlaced++;
      }
    }
  }

  addPolychaete(length, velocityX) {
    const startLeft = (Math.random() < .5);

    let headX;
    let direction;
    let xIncrement;
    if (startLeft) {
      headX = 0;
      direction = RIGHT;
      xIncrement = -16;
    } else {
      headX = this.stage.canvas.width - 16;
      direction = LEFT;
      xIncrement = 16;
    }

    const head = new Head({ x: headX, direction, velocityX });
    this.addSegment(head);

    let lastSegment = head;
    for (let i = 1; i < length; i++) {
      const segment = new Segment({
        x: headX + (xIncrement * i),
        direction,
        velocityX,
      });
      lastSegment.connectNext(segment);
      this.addSegment(segment);
      lastSegment = segment;
    }
  }

  addObject(objects, object) {
    object.setStage(this.stage);
    this.stage.addChild(object.sprite);
    objects.push(object);
  }

  addSegment(segment) {
    this.addObject(this.segments, segment);
  }

  addSegmentToStart(segment) {
    segment.setStage(this.stage);
    this.stage.addChild(segment.sprite);
    this.segments.unshift(segment);
  }

  addSeaSponge(sponge) {
    this.addObject(this.sponges, sponge);
  }

  addBubble(bubble) {
    this.addObject(this.bubbles, bubble);
    this.stage.setChildIndex(bubble.sprite, 1);
  }

  addShrimp(options) {
    const x = 16 * getRandomInt(0, 25);
    const shrimp = new Shrimp(Object.assign({ x }, options));
    this.addObject(this.shrimp, shrimp);
  }

  addCrab(options) {
    const startLeft = (Math.random() < .5);
    let x;
    let direction;
    if (startLeft) {
      x = -24;
      direction = RIGHT;
    } else {
      x = this.stage.canvas.width - 1;
      direction = LEFT;
    }

    const y = getRandomInt(0, 20) * 25;

    this.crab = new Crab(Object.assign({ x, y, direction }, options));
    this.crab.setStage(this.stage);
    this.stage.addChild(this.crab.sprite);
  }

  addLaserBeam(beam) {
    this.addObject(this.laserBeams, beam);
  }

  addBomb(bomb) {
    this.addObject(this.bombs, bomb);
  }

  addExplosion(explosion) {
    this.addObject(this.explosions, explosion);
  }

  addScore(score) {
    this.addObject(this.scores, score);
    this.stage.setChildIndex(score.sprite, this.stage.getNumChildren() - 1);
  }

  fireLaser() {
    this.addLaserBeam(this.diver.fireLaser());
  }

  dropBomb() {
    this.addBomb(this.diver.dropBomb());
  }

  removeObjectAtIdx(objects, idx) {
    const object = objects[idx];
    this.stage.removeChild(object.sprite);
    object.destroy();
    objects.splice(idx, 1);
  }

  removeObjects(objects, idxsToRemove) {
    idxsToRemove.sort().reverse().forEach((idx) => {
      this.removeObjectAtIdx(objects, idx);
    });
  }

  removeAllObjects(objects) {
    while (objects.length > 0) {
      const object = objects.pop();
      this.stage.removeChild(object.sprite);
      object.destroy();
    }
  }

  removeSeaSponges(idxsToRemove) {
    this.removeObjects(this.sponges, idxsToRemove);
  }

  removeAllSeaSponges() {
    this.removeAllObjects(this.sponges);
  }

  removeSegments(idxsToRemove, replace = true) {
    const segmentsToReplace = [];
    idxsToRemove.sort().reverse().forEach((idx) => {
      const segment = this.segments[idx];
      if (replace) {
        const sponge = new SeaSponge({
          x: segment.getX(),
          y: segment.getY(),
        });
        this.addSeaSponge(sponge);
      }
      if (segment.next) {
        segmentsToReplace.push(segment.next);
      }

      this.removeObjectAtIdx(this.segments, idx);
    });

    if (segmentsToReplace.length > 0) {
      this.replaceSegmentsWithHeads(segmentsToReplace);
    }
  }

  replaceSegmentsWithHeads(segmentsToReplace) {
    segmentsToReplace.forEach((segment) => {
      const idx = this.segments.indexOf(segment);
      this.stage.removeChild(segment.sprite);
      const newHead = Head.createHeadFromSegment(segment);
      segment.destroy();
      this.segments.splice(idx, 1);
      // need to add head segments to the start of the segment array
      // so their position gets updated before their trailing segments
      this.addSegmentToStart(newHead);
    });
  }

  removeAllSegments() {
    this.removeAllObjects(this.segments);
  }

  removeShrimp(idxsToRemove) {
    this.removeObjects(this.shrimp, idxsToRemove);
  }

  removeAllShrimp() {
    this.removeAllObjects(this.shrimp);
  }

  removeCrab() {
    if (this.crab) {
      this.stage.removeChild(this.crab.sprite);
      this.crab.destroy();
      this.crab = null;
    }
  }

  removeBubbles(idxsToRemove) {
    this.removeObjects(this.bubbles, idxsToRemove);
  }

  removeLaserBeams(idxsToRemove) {
    this.removeObjects(this.laserBeams, idxsToRemove);
  }

  removeAllLaserBeams() {
    this.removeAllObjects(this.laserBeams);
  }

  removeBombs(idxsToRemove) {
    this.removeObjects(this.bombs, idxsToRemove);
  }

  removeAllBombs() {
    this.removeAllObjects(this.bombs);
  }

  removeExplosions(idxsToRemove) {
    this.removeObjects(this.explosions, idxsToRemove);
  }

  removeAllExplosions() {
    this.removeAllObjects(this.explosions);
  }

  removeScores(idxsToRemove) {
    this.removeObjects(this.scores, idxsToRemove);
  }

  removeAllScores() {
    this.removeAllObjects(this.scores);
  }

  pauseAnimations(paused) {
    this.segments.forEach((segment) => {
      segment.sprite.paused = paused;
    });
    this.explosions.forEach((explosion) => {
      explosion.sprite.paused = paused;
    });
  }
}

export default Board;
