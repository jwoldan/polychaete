import createjs from 'createjs';
import Cookies from 'js-cookie';

import { FPS } from './sprite_sheets';
import { getRandomInt } from '../util/util';
import UIHandler from './ui_handler';
import KeyHandler from './key_handler';
import PositionHandler from './position_handler';
import CollisionHandler from './collision_handler';
import SoundHandler from './sound_handler';

import Board from './board';
import Head from '../objects/head';
import { INITIAL_VELOCITY_X } from '../objects/segment';
import SeaSponge from '../objects/sea_sponge';
import { SPIDER_MIN_VELOCITY } from '../objects/spider';
import { SHRIMP_MIN_VELOCITY } from '../objects/shrimp';

const HIGH_SCORE_COOKIE = 'polychaete-high-score';

class Game {

  constructor(options) {
    this.stage = options.stage;
    this.board = new Board(options);
    this.uiHandler = new UIHandler(this);
    this.keyHandler = new KeyHandler(this);
    this.soundHandler = new SoundHandler();
    this.positionHandler = new PositionHandler(this);
    this.collisionHandler = new CollisionHandler(this);
    this.initialStartLength = options.initialStartLength || 12;
    this.started = false;

    const cookieHighScore = Cookies.get(HIGH_SCORE_COOKIE);
    this.updateHighScore(cookieHighScore ? parseInt(cookieHighScore) : 0);

    this.keyHandler.attachListeners();

    this.playSegmentStep = this.playSegmentStep.bind(this);
    this.tickBombs = this.tickBombs.bind(this);
    this.tickExplosions = this.tickExplosions.bind(this);
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
    createjs.Ticker.on("tick", this.collisionHandler.checkCollisions);
    createjs.Ticker.on("tick", this.positionHandler.updatePositions);
    createjs.Ticker.on("tick", this.playSegmentStep);
    createjs.Ticker.on("tick", this.tickBombs);
    createjs.Ticker.on("tick", this.tickExplosions);
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

  dropBomb() {
    if (!this.started || this.paused) return;
    this.board.dropBomb();
  }

  playSegmentStep(e) {
    if(e.paused) return;
    const segments = this.board.segments;
    if (segments.length > 0 && this.started) {
      const maxVelocity = segments.reduce((a, b) => (
        a.velocityX > b.velocityX ? a.velocityX : b.velocityX
      ), this);
      if (createjs.Ticker.getTicks() % Math.round(32 / maxVelocity) === 0) {
        this.soundHandler.playSegmentStep();
      }
    }
  }

  tickBombs() {
    const bombIdxsToRemove = [];
    this.board.bombs.forEach((bomb, idx) => {
      bomb.tickDown();
      if (bomb.ticks === 0) {
        this.board.addExplosion(bomb.explode());
        bombIdxsToRemove.push(idx);
        this.soundHandler.playExplosionNoise();
      }
    });

    this.removeBombs(bombIdxsToRemove);
  }

  tickExplosions() {
    const explosionIdxsToRemove = [];
    this.board.explosions.forEach((explosion, idx) => {
      explosion.tickDown();
      if (explosion.ticks === 0) {
        explosionIdxsToRemove.push(idx);
      }
    });

    this.removeExplosions(explosionIdxsToRemove);
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
          velocityY: SHRIMP_MIN_VELOCITY + (this.level)
        });
        this.soundHandler.startShrimpOscillator(this.level);
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

  removeBombs(idxsToRemove) {
    idxsToRemove.sort().reverse().forEach((idx) => {
      this.board.removeBombAtIdx(idx);
    });
  }

  removeExplosions(idxsToRemove) {
    idxsToRemove.sort().reverse().forEach((idx) => {
      this.board.removeExplosionAtIdx(idx);
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
