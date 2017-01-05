import createjs from 'createjs';

import { FPS } from '../ui/sprite_sheets';

import { getRandomInt } from '../util/util';

import Diver from '../objects/diver';
import Head from '../objects/head';
import Segment from '../objects/segment';
import { LEFT, RIGHT } from '../objects/moving_object';
import SeaSponge from '../objects/sea_sponge';
import Spider from '../objects/spider';
import Shrimp from '../objects/shrimp';

class Board {

  constructor(options) {
    this.stage = options.stage;

    this.laserBeams = [];
    this.bombs = [];
    this.explosions = [];
    this.segments = [];
    this.sponges = [];
    this.shrimp = [];
    this.spider = null;

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
    this.removeSpider();
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
      .beginFill('black')
      .drawRect(0, 0, this.stage.canvas.width, this.stage.canvas.height);
    this.stage.addChild(background);
    this.stage.setChildIndex(background, 0);
    this.stage.update();
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

  addShrimp(options) {
    const x = 16 * getRandomInt(0, 25);
    const shrimp = new Shrimp(Object.assign({ x }, options));
    shrimp.setStage(this.stage);
    this.stage.addChild(shrimp.sprite);
    this.shrimp.push(shrimp);
  }

  addSpider(options) {
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

    this.spider = new Spider(Object.assign({ x, y, direction }, options));
    this.spider.setStage(this.stage);
    this.stage.addChild(this.spider.sprite);
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

  removeAllShrimp() {
    this.shrimp.forEach((shrimp) => {
      this.stage.removeChild(shrimp.sprite);
      shrimp.destroy();
    });
    this.shrimp = [];
  }

  removeSpider() {
    if (this.spider) {
      this.stage.removeChild(this.spider.sprite);
      this.spider.destroy();
      this.spider = null;
    }
  }

  removeLaserBeamAtIdx(idx) {
    const laserBeam = this.laserBeams[idx];
    this.stage.removeChild(laserBeam.sprite);
    laserBeam.destroy();
    this.laserBeams.splice(idx, 1);
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

  removeAllExplosions() {
    this.explosions.forEach((explosion) => {
      this.stage.removeChild(explosion.sprite);
      explosion.destroy();
    });
    this.explosions = [];
  }

  pauseAnimations(paused) {
    this.segments.forEach((segment) => {
      segment.sprite.paused = paused;
    });
  }
}

export default Board;
