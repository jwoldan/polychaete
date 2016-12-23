import createjs from 'createjs';

import { FPS } from '../display/sprite_sheets';
import KeyHandler from './key_handler';
import { getRandomInt } from '../util/util';

import Diver from '../models/diver';
import Segment from '../models/segment';
import SeaSponge from '../models/sea_sponge';

const MAX_SPONGE_Y = 580;

class Game {

  constructor(options) {
    this.stage = options.stage;

    this.laserBeams = [];
    this.segments = [];
    this.sponges = [];

    this.updatePositions = this.updatePositions.bind(this);
    this.checkCollisions = this.checkCollisions.bind(this);
  }

  initialize() {
    this.setBackground();
    this.diver = new Diver();
    this.diver.setStage(this.stage);
    this.stage.addChild(this.diver.sprite);
    this.addSeaSponges(20);

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
  }

  removeFromArray(array, idxsToRemove) {
    idxsToRemove.sort().reverse().forEach((idx) => {
      if (array[idx] instanceof Segment) {
        const segment = array[idx];
        const sponge = new SeaSponge({
          x: segment.getX(),
          y: segment.getY(),
        });
        this.addSeaSponge(sponge);
      }

      this.stage.removeChild(array[idx].sprite);
      array[idx].destroy();
      array.splice(idx, 1);
    });
  }
}

export default Game;
