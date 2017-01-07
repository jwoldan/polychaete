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

  addSegment(segment) {
    segment.setStage(this.stage);
    this.stage.addChild(segment.sprite);
    this.segments.push(segment);
  }

  addSegmentToStart(segment) {
    segment.setStage(this.stage);
    this.stage.addChild(segment.sprite);
    this.segments.unshift(segment);
  }

  addSeaSponge(sponge) {
    sponge.setStage(this.stage);
    this.stage.addChild(sponge.sprite);
    this.sponges.push(sponge);
  }

  addBubble(bubble) {
    bubble.setStage(this.stage);
    this.stage.addChild(bubble.sprite);
    this.stage.setChildIndex(bubble.sprite, 1);
    this.bubbles.push(bubble);
  }

  addShrimp(options) {
    const x = 16 * getRandomInt(0, 25);
    const shrimp = new Shrimp(Object.assign({ x }, options));
    shrimp.setStage(this.stage);
    this.stage.addChild(shrimp.sprite);
    this.shrimp.push(shrimp);
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
    beam.setStage(this.stage);
    this.stage.addChild(beam.sprite);
    this.laserBeams.push(beam);
  }

  addBomb(bomb) {
    bomb.setStage(this.stage);
    this.stage.addChild(bomb.sprite);
    this.bombs.push(bomb);
  }

  addExplosion(explosion) {
    explosion.setStage(this.stage);
    this.stage.addChild(explosion.sprite);
    this.explosions.push(explosion);
  }

  addScore(score) {
    score.setStage(this.stage);
    this.stage.addChild(score.sprite);
    this.stage.setChildIndex(score.sprite, this.stage.getNumChildren() - 1);
    this.scores.push(score);
  }

  fireLaser() {
    this.addLaserBeam(this.diver.fireLaser());
  }

  dropBomb() {
    this.addBomb(this.diver.dropBomb());
  }

  removeSeaSpongeAtIdx(idx) {
    const sponge = this.sponges[idx];
    this.stage.removeChild(sponge.sprite);
    sponge.destroy();
    this.sponges.splice(idx, 1);
  }

  removeSeaSponges(idxsToRemove) {
    idxsToRemove.sort().reverse().forEach((idx) => {
      this.removeSeaSpongeAtIdx(idx);
    });
  }

  removeAllSeaSponges() {
    this.sponges.forEach((sponge) => {
      this.stage.removeChild(sponge.sprite);
      sponge.destroy();
    });
    this.sponges = [];
  }

  removeSegmentAtIdx(idx) {
    const segment = this.segments[idx];
    this.stage.removeChild(segment.sprite);
    segment.destroy();
    this.segments.splice(idx, 1);
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

      this.removeSegmentAtIdx(idx);
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
    this.segments.forEach((segment) => {
      this.stage.removeChild(segment.sprite);
      segment.destroy();
    });
    this.segments = [];
  }

  removeShrimpAtIdx(idx) {
    const shrimp = this.shrimp[idx];
    this.stage.removeChild(shrimp.sprite);
    shrimp.destroy();
    this.shrimp.splice(idx, 1);
  }

  removeShrimp(idxsToRemove) {
    idxsToRemove.sort().reverse().forEach((idx) => {
      this.removeShrimpAtIdx(idx);
    });
  }

  removeAllShrimp() {
    this.shrimp.forEach((shrimp) => {
      this.stage.removeChild(shrimp.sprite);
      shrimp.destroy();
    });
    this.shrimp = [];
  }

  removeCrab() {
    if (this.crab) {
      this.stage.removeChild(this.crab.sprite);
      this.crab.destroy();
      this.crab = null;
    }
  }

  removeBubbleAtIdx(idx) {
    const bubble = this.bubbles[idx];
    this.stage.removeChild(bubble.sprite);
    bubble.destroy();
    this.bubbles.splice(idx, 1);
  }

  removeBubbles(idxsToRemove) {
    idxsToRemove.sort().reverse().forEach((idx) => {
      this.removeBubbleAtIdx(idx);
    });
  }

  removeLaserBeamAtIdx(idx) {
    const laserBeam = this.laserBeams[idx];
    this.stage.removeChild(laserBeam.sprite);
    laserBeam.destroy();
    this.laserBeams.splice(idx, 1);
  }

  removeLaserBeams(idxsToRemove) {
    idxsToRemove.sort().reverse().forEach((idx) => {
      this.removeLaserBeamAtIdx(idx);
    });
  }

  removeAllLaserBeams() {
    this.laserBeams.forEach((beam) => {
      this.stage.removeChild(beam.sprite);
      beam.destroy();
    });
    this.laserBeams = [];
  }

  removeBombAtIdx(idx) {
    const bomb = this.bombs[idx];
    this.stage.removeChild(bomb.sprite);
    bomb.destroy();
    this.bombs.splice(idx, 1);
  }

  removeBombs(idxsToRemove) {
    idxsToRemove.sort().reverse().forEach((idx) => {
      this.removeBombAtIdx(idx);
    });
  }

  removeAllBombs() {
    this.bombs.forEach((bomb) => {
      this.stage.removeChild(bomb.sprite);
      bomb.destroy();
    });
    this.bombs = [];
  }

  removeExplosionAtIdx(idx) {
    const explosion = this.explosions[idx];
    this.stage.removeChild(explosion.sprite);
    explosion.destroy();
    this.explosions.splice(idx, 1);
  }

  removeExplosions(idxsToRemove) {
    idxsToRemove.sort().reverse().forEach((idx) => {
      this.removeExplosionAtIdx(idx);
    });
  }

  removeAllExplosions() {
    this.explosions.forEach((explosion) => {
      this.stage.removeChild(explosion.sprite);
      explosion.destroy();
    });
    this.explosions = [];
  }

  removeScoreAtIdx(idx) {
    const score = this.scores[idx];
    this.stage.removeChild(score.sprite);
    score.destroy();
    this.scores.splice(idx, 1);
  }

  removeScores(idxsToRemove) {
    idxsToRemove.sort().reverse().forEach((idx) => {
      this.removeScoreAtIdx(idx);
    });
  }

  removeAllScores() {
    this.scores.forEach((score) => {
      this.stage.removeChild(score.sprite);
      score.destroy();
    });
    this.scores = [];
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
