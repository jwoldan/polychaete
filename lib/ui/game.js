import createjs from 'createjs';
import Cookies from 'js-cookie';

import { FPS } from './sprite_sheets';
import UIHandler from './ui_handler';
import KeyHandler from './key_handler';
import SoundHandler from './sound_handler';

import Board from './board';
import Head from '../objects/head';
import Segment, { INITIAL_VELOCITY_X } from '../objects/segment';
import SeaSponge from '../objects/sea_sponge';

const HIGH_SCORE_COOKIE = 'polychaete-high-score';

class Game {

  constructor(options) {
    this.stage = options.stage;
    this.uiHandler = new UIHandler(this);
    this.keyHandler = new KeyHandler(this);
    this.soundHandler = new SoundHandler();
    this.board = new Board(options);
    this.initialStartLength = options.initialStartLength || 12;
    this.started = false;

    const cookieHighScore = Cookies.get(HIGH_SCORE_COOKIE);
    this.updateHighScore(cookieHighScore ? parseInt(cookieHighScore) : 0);

    this.keyHandler.attachListeners();

    this.updatePositions = this.updatePositions.bind(this);
    this.checkCollisions = this.checkCollisions.bind(this);
  }

  initialize(startGame) {
    this.startLength = this.initialStartLength;
    this.velocityX = INITIAL_VELOCITY_X;
    this.currentScore = 0;
    this.newHighScore = false;
    this.uiHandler.updateCurrentScore(this.currentScore);
    // this.keyHandler.reset();

    const board = this.board;
    board.reset();
    if (startGame) {
      board.addDiver();
      this.started = true;
    }
    board.addSeaSponges(20);
    board.addPolychaete(this.startLength, this.velocityX);

    this.paused = false;
    createjs.Ticker.paused = false;
  }

  run() {
    createjs.Ticker.setFPS(FPS);
    createjs.Ticker.on("tick", this.stage);
    createjs.Ticker.on("tick", this.keyHandler.handleTick);
    createjs.Ticker.on("tick", this.checkCollisions);
    createjs.Ticker.on("tick", this.updatePositions);
  }

  moveDiver(xDiff, yDiff) {
    if (!this.started || this.paused) return;
    this.board.diver.changeBoundedPos(xDiff, yDiff);
  }

  fireLaser() {
    if (!this.started || this.paused) return;
    this.board.fireLaser();
    this.soundHandler.playLaserSound();
  }

  updatePositions(e) {
    if (e.paused) return;

    const idxsToRemove = [];
    const board = this.board;

    board.laserBeams.forEach((beam, idx) => {
      beam.updatePosition();
      if (beam.getY() <= -beam.getHeight()) {
        idxsToRemove.push(idx);
      }
    });

    if (board.segments.length > 0 && this.started) {
      const maxVelocity = board.segments.reduce((a, b) => (
        a.velocityX > b.velocityX ? a.velocityX : b.velocityX
      ), this);
      if (createjs.Ticker.getTicks() % Math.round(32 / maxVelocity) === 0) {
        this.soundHandler.playSegmentStep();
      }
    }

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

  checkCollisions(e) {
    if (e.paused) return;

    const board = this.board;
    const diver = board.diver;
    const beamIdxsToRemove = [];
    const segmentIdxsToRemove = [];
    const spongeIdxsToRemove = [];

    if (this.started) {
      board.segments.forEach((segment) => {
        if (segment.overlaps(diver)) {
          this.endGame();
        }
      });
    }

    board.laserBeams.forEach((beam, beamIdx) => {
      // only allow a laser beam a single hit
      let hit = false;

      // check for collision with sea sponges
      board.sponges.forEach((sponge, spongeIdx) =>{
        if (beam.overlaps(sponge) && !hit) {
          beamIdxsToRemove.push(beamIdx);
          sponge.handleHit();
          if(sponge.hits === 0) {
            spongeIdxsToRemove.push(spongeIdx);
            this.incrementScore(1);
            this.soundHandler.playSeaSpongeDestroy();
          } else {
            this.soundHandler.playSeaSpongeHit();
          }
          hit = true;
        }
      });

      // check for collision with Polychaete segments
      board.segments.forEach((segment, segmentIdx) => {
        if (beam.overlaps(segment) && !hit) {
          if (segment instanceof Head) {
            this.incrementScore(100);
          } else {
            this.incrementScore(10);
          }
          this.soundHandler.playSegmentHit();
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
      this.startLength -= 1;
      if (this.startLength === 0) {
        this.startLength = this.initialStartLength;
        if (this.velocityX < 4) this.velocityX *= 2;
      }
      board.addPolychaete(this.startLength, this.velocityX);
      if (this.startLength !== this.initialStartLength) {
        window.setTimeout(() => {
          board.addPolychaete(1, this.velocityX + 1);
        }, Math.random() * 1000 + 500);
      }
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

  incrementScore(addlScore) {
    this.currentScore += addlScore;
    this.uiHandler.updateCurrentScore(this.currentScore);

    if (this.currentScore > this.highScore) {
      this.updateHighScore(this.currentScore);
    }
  }

  updateHighScore(newHighScore) {
    this.highScore = newHighScore;
    this.uiHandler.updateHighScore(this.highScore);
    this.newHighScore = true;
  }

  setPaused(paused) {
    this.paused = paused;
    createjs.Ticker.paused = paused;
    this.board.pauseAnimations(paused);
  }

  endGame() {
    this.setPaused(true);
    this.started = false;
    Cookies.set(HIGH_SCORE_COOKIE, this.highScore);
    window.setTimeout(
      () => this.uiHandler.showGameOverPopup(this.newHighScore),
      100
    );
  }
}

export default Game;
