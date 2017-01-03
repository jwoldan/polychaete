import createjs from 'createjs';
import Cookies from 'js-cookie';

import { FPS } from './sprite_sheets';
import { getRandomInt } from '../util/util';
import UIHandler from './ui_handler';
import KeyHandler from './key_handler';
import SoundHandler from './sound_handler';

import Board from './board';
import Head from '../objects/head';
import Segment, { INITIAL_VELOCITY_X } from '../objects/segment';
import SeaSponge from '../objects/sea_sponge';
import { SPIDER_MIN_VELOCITY } from '../objects/spider';
import { SHRIMP_MIN_VELOCITY } from '../objects/shrimp';

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
    this.tryAddSpider = this.tryAddSpider.bind(this);
    this.tryAddShrimp = this.tryAddShrimp.bind(this);
  }

  initialize(startGame) {
    this.startLength = this.initialStartLength;
    this.level = 0;
    this.currentScore = 0;
    this.newHighScore = false;
    this.uiHandler.updateCurrentScore(this.currentScore);

    const board = this.board;
    board.reset();
    if (startGame) {
      board.addDiver();
      this.started = true;
      this.soundHandler.pause(false);
    }
    board.addSeaSponges(30);
    board.addPolychaete(this.startLength, INITIAL_VELOCITY_X);

    this.paused = false;
    createjs.Ticker.paused = false;
  }

  run() {
    createjs.Ticker.setFPS(FPS);
    createjs.Ticker.on("tick", this.stage);
    createjs.Ticker.on("tick", this.keyHandler.handleTick);
    createjs.Ticker.on("tick", this.checkCollisions);
    createjs.Ticker.on("tick", this.updatePositions);
    createjs.Ticker.on("tick", this.tryAddSpider);
    createjs.Ticker.on("tick", this.tryAddShrimp);
  }

  moveDiver(xDiff, yDiff) {
    if (!this.started || this.paused) return;

    const board = this.board;
    const diver = board.diver;
    let blocked = false;
    diver.changeBoundedPos(xDiff, yDiff);
    board.sponges.forEach((sponge) => {
      if (sponge.overlaps(diver)) {
        blocked = true;
      }
    });
    if (blocked) diver.changeBoundedPos(-xDiff, -yDiff);
  }

  fireLaser() {
    if (!this.started || this.paused) return;
    this.board.fireLaser();
    this.soundHandler.playLaserSound();
  }

  updatePositions(e) {
    if (e.paused) return;
    this.updateLaserBeamPositions();
    this.updateSegmentPositions();
    this.updateShrimpPositions();
    this.updateSpiderPosition();
  }

  updateLaserBeamPositions() {
    const laserBeams = this.board.laserBeams;
    const laserIdxsToRemove = [];
    laserBeams.forEach((beam, idx) => {
      beam.updatePosition();
      if (beam.getY() <= -beam.getHeight()) {
        laserIdxsToRemove.push(idx);
      }
    });
    this.removeLaserBeams(laserIdxsToRemove);
  }

  updateSegmentPositions() {
    const segments = this.board.segments;
    segments.forEach((segment) => {
      let collided = false;
      this.board.sponges.forEach((sponge) => {
        if (segment.overlaps(sponge)) {
          collided = true;
        }
      });
      segment.updatePosition(collided);
    });

    if (segments.length > 0 && this.started) {
      const maxVelocity = segments.reduce((a, b) => (
        a.velocityX > b.velocityX ? a.velocityX : b.velocityX
      ), this);
      if (createjs.Ticker.getTicks() % Math.round(32 / maxVelocity) === 0) {
        this.soundHandler.playSegmentStep();
      }
    }
  }

  updateShrimpPositions() {
    const shrimps = this.board.shrimp;
    const shrimpIdxsToRemove = [];
    shrimps.forEach((shrimp, idx) => {
      shrimp.updatePosition();
      if (!shrimp.isPartiallyInMoveBounds()) {
        shrimpIdxsToRemove.push(idx);
      }
    });
    this.removeShrimp(shrimpIdxsToRemove);
  }

  updateSpiderPosition() {
    const spider = this.board.spider;
    if (spider) {
      spider.updatePosition();
      if (!spider.isPartiallyInMoveBounds()) this.removeSpider();
    }
  }

  checkCollisions(e) {
    if (e.paused) return;
    if (this.started) {
      this.checkSegmentDiverCollisions();
      this.checkSpiderCollisions();
    }
    if (this.started) {
      this.checkLaserBeamCollisions();
    }
    this.tryAddPolychaete();
  }

  checkSegmentDiverCollisions() {
    this.board.segments.forEach((segment) => {
      if (segment.overlaps(this.board.diver)) {
        this.endGame();
      }
    });
  }

  checkSpiderCollisions() {
    const spider = this.board.spider;
    const spongeIdxsToRemove = [];

    if (spider) {
      if (spider.overlaps(this.board.diver)) {
        this.endGame();
      }
      this.board.sponges.forEach((sponge, spongeIdx) => {
        if (spider.overlaps(sponge)) {
          spongeIdxsToRemove.push(spongeIdx);
        }
      });
      this.removeSeaSponges(spongeIdxsToRemove);
    }
  }

  checkLaserBeamCollisions() {
    const laserBeams = this.board.laserBeams;
    const beamIdxsToRemove = [];
    const spongeIdxsToRemove = [];
    const segmentIdxsToRemove = [];

    laserBeams.forEach((beam, beamIdx) => {
      // only allow a laser beam a single hit
      let hit = false;

      const spongeIdx = this.checkLaserBeamSpongeCollisions(beam);
      if (spongeIdx) {
        if (spongeIdx !== true) {
          spongeIdxsToRemove.push(spongeIdx);
        }
        beamIdxsToRemove.push(beamIdx);
      } else {
        const segmentIdx = this.checkLaserBeamSegmentCollisions(beam);
        if (segmentIdx) {
          beamIdxsToRemove.push(beamIdx);
          segmentIdxsToRemove.push(segmentIdx);
        } else {
          const spiderHit = this.checkLaserBeamSpiderCollisions(beam);
          if (spiderHit) {
            this.removeSpider();
            beamIdxsToRemove.push(beamIdx);
          }
        }
      }

    });

    this.removeLaserBeams(beamIdxsToRemove);
    this.removeSeaSponges(spongeIdxsToRemove);
    this.removeSegments(segmentIdxsToRemove);
  }

  checkLaserBeamSpongeCollisions(beam) {
    const sponges = this.board.sponges;
    for (let i = 0; i < sponges.length; i++) {
      if (beam.overlaps(sponges[i])) {
        sponges[i].handleHit();
        if(sponges[i].hits === 0) {
          this.incrementScore(1);
          this.soundHandler.playSeaSpongeDestroy();
          return i;
        } else {
          this.soundHandler.playSeaSpongeHit();
          return true;
        }
      }
    }
    return false;
  }

  checkLaserBeamSegmentCollisions(beam) {
    const segments = this.board.segments;
    for (let i = 0; i < segments.length; i++) {
      if (beam.overlaps(segments[i])) {
        if (segments[i] instanceof Head) {
          this.incrementScore(100);
        } else {
          this.incrementScore(10);
        }
        this.soundHandler.playSegmentHit();
        return i;
      }
    }
    return false;
  }

  checkLaserBeamSpiderCollisions(beam) {
    const spider = this.board.spider;
    if (spider && beam.overlaps(spider)) {
      if (spider.getY() > 500) {
        this.incrementScore(300);
      } else if (spider.getY() > 400) {
        this.incrementScore(600);
      } else {
        this.incrementScore(900);
      }
      this.soundHandler.playSpiderHit();
      return true;
    }
    return false;
  }

  tryAddPolychaete() {
    const board = this.board;

    if (board.segments.length === 0) {
      this.startLength -= 1;
      if (this.startLength === 0) {
        this.startLength = this.initialStartLength;
      }
      if (this.level < 6 && this.startLength % 3 === 0) {
        this.level += 1;
        this.soundHandler.incrementBPM(10);
      }
      const velocityX = INITIAL_VELOCITY_X + this.level;
      board.addPolychaete(this.startLength, velocityX);
      if (this.startLength !== this.initialStartLength) {
        window.setTimeout(() => {
          board.addPolychaete(1, velocityX + 1);
        }, Math.random() * 1000 + 500);
      }
    }
  }

  tryAddSpider(e) {
    if (e.paused) return;
    const board = this.board;
    if (this.started &&
        !board.spider &&
        (createjs.Ticker.getTicks() % (FPS / 2) === 0)) {
      const random = getRandomInt(0, 8);
      if (random <= this.level) {
        board.addSpider({
          maximumVelocity: SPIDER_MIN_VELOCITY + (2 * this.level)
        });
        this.soundHandler.startSpiderSequence();
      }
    }
  }

  tryAddShrimp(e) {
    if (e.paused) return;
    const board = this.board;
    if (this.started &&
        (createjs.Ticker.getTicks() % (FPS / 2) === (FPS / 4))) {
      const random = getRandomInt(0, 8);
      if (random <= this.level) {
        board.addShrimp({
          velocityY: SHRIMP_MIN_VELOCITY + (2 * this.level)
        });
        this.soundHandler.startShrimpOscillator();
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

  removeShrimp(idxsToRemove) {
    idxsToRemove.sort().reverse().forEach((idx) => {
      this.board.removeShrimpAtIdx(idx);
    });
    if (this.board.shrimp.length === 0) {
      this.soundHandler.stopShrimpOscillator();
    }
  }

  replaceSegmentsWithHeads(segmentsToReplace) {
    const board = this.board;
    segmentsToReplace.forEach((segment) => {
      const idx = board.segments.indexOf(segment);
      board.stage.removeChild(segment.sprite);
      const newHead = Head.createHeadFromSegment(segment);
      segment.destroy();
      board.segments.splice(idx, 1);
      // need to add head segments to the start of the segment array
      // so their position gets updated before their trailing segments
      board.addSegmentToStart(newHead);
    });
  }

  removeSpider() {
    this.board.removeSpider();
    this.soundHandler.stopSpiderSequence();
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
    this.soundHandler.pause(paused);
  }

  endGame() {
    this.soundHandler.reset();
    this.setPaused(true);
    this.soundHandler.resetBPM();
    this.started = false;
    Cookies.set(HIGH_SCORE_COOKIE, this.highScore, { expires: 3650 });
    window.setTimeout(
      () => this.uiHandler.showGameOverPopup(this.newHighScore),
      100
    );
  }
}

export default Game;
