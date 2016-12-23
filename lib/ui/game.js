import createjs from 'createjs';

import { FPS } from '../ui/sprite_sheets';
import KeyHandler from './key_handler';
import { getRandomInt } from '../util/util';

import Diver from '../objects/diver';
import Head from '../objects/head';
import Segment, { LEFT, RIGHT } from '../objects/segment';
import SeaSponge from '../objects/sea_sponge';

const MAX_SPONGE_Y = 580;

class Game {

  constructor(options) {
    this.stage = options.stage;

    this.laserBeams = [];
    this.segments = [];
    this.sponges = [];
    this.startLength = options.startLength || 12;

    this.updatePositions = this.updatePositions.bind(this);
    this.checkCollisions = this.checkCollisions.bind(this);
    this.addPolychaete = this.addPolychaete.bind(this);
    this.addBabyPolychaete = this.addBabyPolychaete.bind(this);
  }

  initialize() {
    this.setBackground();
    this.diver = new Diver();
    this.diver.setStage(this.stage);
    this.stage.addChild(this.diver.sprite);
    // this.addSeaSponges(20);
    this.addPolychaete(this.startLength);

    this.keyHandler = new KeyHandler(this);
    this.keyHandler.attachListeners();
  }

  addSeaSponges(numSponges) {
    let spongesPlaced = 0;

    while(spongesPlaced < numSponges) {
      const x = 16 * getRandomInt(0, 29);
      const y = 20 * getRandomInt(1, 29);

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

  addPolychaete(length) {
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

    const head = new Head({ x: headX, direction });
    this.addSegment(head);

    let lastSegment = head;
    for (let i = 1; i < length; i++) {
      const segment = new Segment({ x: headX + (xIncrement * i), direction });
      lastSegment.connectNext(segment);
      this.addSegment(segment);
      lastSegment = segment;
    }
  }

  addBabyPolychaete() {
    this.addPolychaete(1);
  }

  run() {
    createjs.Ticker.setFPS(FPS);
    createjs.Ticker.on("tick", this.stage);
    createjs.Ticker.on("tick", this.keyHandler.handleTick);
    createjs.Ticker.on("tick", this.checkCollisions);
    createjs.Ticker.on("tick", this.updatePositions);
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

  addSegment(segment) {
    segment.setStage(this.stage);
    this.stage.addChild(segment.sprite);
    this.segments.push(segment);
  }

  addSeaSponge(sponge) {
    sponge.setStage(this.stage);
    this.stage.addChild(sponge.sprite);
    this.sponges.push(sponge);
  }

  addLaserBeam(beam) {
    beam.setStage(this.stage);
    this.stage.addChild(beam.sprite);
    this.laserBeams.push(beam);
  }

  moveDiver(xDiff, yDiff) {
    this.diver.changeBoundedPos(xDiff, yDiff);
  }

  fireLaser() {
    this.addLaserBeam(this.diver.fireLaser());
  }

  updatePositions() {
    const idxsToRemove = [];

    this.laserBeams.forEach((beam, idx) => {
      beam.updatePosition();
      if (beam.getY() <= -beam.getHeight()) {
        idxsToRemove.push(idx);
      }
    });

    this.segments.forEach((segment) => {
      let collided = false;
      this.sponges.forEach((sponge) => {
        if (segment.overlaps(sponge)) {
          collided = true;
        }
      });
      segment.updatePosition(collided);
    });

    this.removeFromArray(this.laserBeams, idxsToRemove);
  }

  checkCollisions() {
    const beamIdxsToRemove = [];
    const segmentIdxsToRemove = [];
    const spongeIdxsToRemove = [];

    this.laserBeams.forEach((beam, beamIdx) => {
      // only allow a laser beam a single hit
      let hit = false;

      // check for collision with sea sponges
      this.sponges.forEach((sponge, spongeIdx) =>{
        if (beam.overlaps(sponge) && !hit) {
          beamIdxsToRemove.push(beamIdx);
          sponge.handleHit();
          if(sponge.hits === 0) spongeIdxsToRemove.push(spongeIdx);
          hit = true;
        }
      });

      // check for collision with Polychaete segments
      this.segments.forEach((segment, segmentIdx) => {
        if (beam.overlaps(segment) && !hit) {
          beamIdxsToRemove.push(beamIdx);
          segmentIdxsToRemove.push(segmentIdx);
          hit = true;
        }
      });

    });

    this.removeFromArray(this.laserBeams, beamIdxsToRemove);
    this.removeFromArray(this.segments, segmentIdxsToRemove);
    this.removeFromArray(this.sponges, spongeIdxsToRemove);

    if (this.segments.length === 0) {
      this.addPolychaete(--this.startLength);
      window.setTimeout(this.addPolychaete, Math.random() * 1000);
    }
  }

  removeFromArray(array, idxsToRemove) {
    const addlObjsToRemove = [];
    const segmentsToReplace = [];
    idxsToRemove.sort().reverse().forEach((idx) => {
      if (array[idx] instanceof Segment) {
        const segment = array[idx];
        const sponge = new SeaSponge({
          x: segment.getX(),
          y: segment.getY(),
        });
        this.addSeaSponge(sponge);
        if (segment.next) {
          segmentsToReplace.push(segment.next);
        }
      }

      this.stage.removeChild(array[idx].sprite);
      array[idx].destroy();
      array.splice(idx, 1);
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
      this.addSegment(newHead);
    });
  }
}

export default Game;
