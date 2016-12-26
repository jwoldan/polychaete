import createjs from 'createjs';

import { FPS } from '../ui/sprite_sheets';
import KeyHandler from './key_handler';

import Board from './board';
import Head from '../objects/head';
import Segment from '../objects/segment';
import SeaSponge from '../objects/sea_sponge';

class Game {

  constructor(options) {
    this.stage = options.stage;
    this.board = new Board(options);

    this.startLength = options.startLength || 12;

    this.updatePositions = this.updatePositions.bind(this);
    this.checkCollisions = this.checkCollisions.bind(this);
  }

  initialize() {
    const board = this.board;
    board.addDiver();
    board.addSeaSponges(20);
    board.addPolychaete(this.startLength);

    this.keyHandler = new KeyHandler(this);
    this.keyHandler.attachListeners();
  }

  run() {
    createjs.Ticker.setFPS(FPS);
    createjs.Ticker.on("tick", this.stage);
    createjs.Ticker.on("tick", this.keyHandler.handleTick);
    createjs.Ticker.on("tick", this.checkCollisions);
    createjs.Ticker.on("tick", this.updatePositions);
  }

  moveDiver(xDiff, yDiff) {
    this.board.diver.changeBoundedPos(xDiff, yDiff);
  }

  fireLaser() {
    this.board.fireLaser();
  }

  updatePositions() {
    const idxsToRemove = [];
    const board = this.board;

    board.laserBeams.forEach((beam, idx) => {
      beam.updatePosition();
      if (beam.getY() <= -beam.getHeight()) {
        idxsToRemove.push(idx);
      }
    });

    board.segments.forEach((segment) => {
      let collided = false;
      board.sponges.forEach((sponge) => {
        if (segment.overlaps(sponge)) {
          collided = true;
        }
      });
      // if (!collided) {
      //   board.segments.forEach((otherSegment) => {
      //     if (segment.direction !== otherSegment.direction &&
      //         segment.overlaps(otherSegment)) {
      //       collided = true;
      //     }
      //   });
      // }
      segment.updatePosition(collided);
    });

    this.removeLaserBeams(idxsToRemove);
  }

  checkCollisions() {
    const board = this.board;
    const beamIdxsToRemove = [];
    const segmentIdxsToRemove = [];
    const spongeIdxsToRemove = [];

    board.laserBeams.forEach((beam, beamIdx) => {
      // only allow a laser beam a single hit
      let hit = false;

      // check for collision with sea sponges
      board.sponges.forEach((sponge, spongeIdx) =>{
        if (beam.overlaps(sponge) && !hit) {
          beamIdxsToRemove.push(beamIdx);
          sponge.handleHit();
          if(sponge.hits === 0) spongeIdxsToRemove.push(spongeIdx);
          hit = true;
        }
      });

      // check for collision with Polychaete segments
      board.segments.forEach((segment, segmentIdx) => {
        if (beam.overlaps(segment) && !hit) {
          beamIdxsToRemove.push(beamIdx);
          segmentIdxsToRemove.push(segmentIdx);
          hit = true;
        }
      });

    });

    this.removeLaserBeams(beamIdxsToRemove);
    this.removeSegments(segmentIdxsToRemove);
    this.removeSeaSponges(spongeIdxsToRemove);

    if (board.segments.length === 0) {
      board.addPolychaete(--this.startLength);
      window.setTimeout(board.addBabyPolychaete, Math.random() * 1000);
    }
  }

  removeSeaSponges(idxsToRemove) {
    idxsToRemove.sort().reverse().forEach((idx) => {
      this.board.removeSeaSpongeAtIdx(idx);
    });
  }

  removeSegments(idxsToRemove) {
    const board = this.board;
    const segmentsToReplace = [];
    idxsToRemove.sort().reverse().forEach((idx) => {
      const segment = board.segments[idx];
      const sponge = new SeaSponge({
        x: segment.getX(),
        y: segment.getY(),
      });
      board.addSeaSponge(sponge);
      if (segment.next) {
        segmentsToReplace.push(segment.next);
      }

      board.removeSegmentAtIdx(idx);
    });

    if (segmentsToReplace.length > 0) {
      this.replaceSegmentsWithHeads(segmentsToReplace);
    }
  }

  removeLaserBeams(idxsToRemove) {
    idxsToRemove.sort().reverse().forEach((idx) => {
      this.board.removeLaserBeamAtIdx(idx);
    });
  }

  replaceSegmentsWithHeads(segmentsToReplace) {
    const board = this.board;
    segmentsToReplace.forEach((segment) => {
      const idx = board.segments.indexOf(segment);
      board.stage.removeChild(segment.sprite);
      const newHead = Head.createHeadFromSegment(segment);
      segment.destroy();
      board.segments.splice(idx, 1);
      board.addSegment(newHead);
    });
  }
}

export default Game;
