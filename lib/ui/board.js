import createjs from 'createjs';

import { FPS } from '../ui/sprite_sheets';

import { getRandomInt } from '../util/util';

import Diver from '../objects/diver';
import Head from '../objects/head';
import Segment from '../objects/segment';
import { LEFT, RIGHT } from '../objects/moving_object';
import SeaSponge from '../objects/sea_sponge';
import Spider from '../objects/spider';


class Board {

  constructor(options) {
    this.stage = options.stage;

    this.laserBeams = [];
    this.segments = [];
    this.sponges = [];
    this.spider = null;

    this.setBackground();
  }

  reset() {
    this.removeDiver();
    this.removeAllSeaSponges();
    this.removeAllSegments();
    this.removeAllLaserBeams();
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

    this.spider = new Spider(Object.assign(options, { x, y, direction }));
    this.spider.setStage(this.stage);
    this.stage.addChild(this.spider.sprite);
  }

  addLaserBeam(beam) {
    beam.setStage(this.stage);
    this.stage.addChild(beam.sprite);
    this.laserBeams.push(beam);
  }

  fireLaser() {
    this.addLaserBeam(this.diver.fireLaser());
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

  pauseAnimations(paused) {
    this.segments.forEach((segment) => {
      segment.sprite.paused = paused;
    });
  }
}

export default Board;
