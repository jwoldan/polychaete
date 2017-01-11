import createjs from 'createjs';
import Cookies from 'js-cookie';

import { FPS } from '../ui/sprite_sheets';
import { getRandomInt } from '../util/util';

import PositionHandler from './position_handler';
import CollisionHandler from './collision_handler';

import Board from '../ui/board';
import UIHandler from '../ui/ui_handler';
import KeyHandler from '../ui/key_handler';
import SoundHandler from '../ui/sound_handler';

import Bubble, { BUBBLE_SIZES } from '../objects/bubble';
import Head from '../objects/head';
import { INITIAL_VELOCITY_X } from '../objects/segment';
import SeaSponge from '../objects/sea_sponge';
import { CRAB_MIN_VELOCITY } from '../objects/crab';
import { SHRIMP_MIN_VELOCITY } from '../objects/shrimp';

const HIGH_SCORE_COOKIE = 'polychaete-high-score';
const MUTE_COOKIE = 'polychate-mute';
const INITIAL_BOMB_COUNT = 1;
const MAX_BOMB_COUNT = 3;
const NEXT_BOMB_INCREMENT = 2500;

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
    const muteCookie = Cookies.get(MUTE_COOKIE);
    if (muteCookie) this.uiHandler.toggleMute();

    this.keyHandler.attachListeners();
    this.board.addBubbles(20);

    this.tick = this.tick.bind(this);
  }

  initialize(startGame) {
    this.startLength = this.initialStartLength;
    this.level = 0;
    this.currentScore = 0;
    this.newHighScore = false;
    this.uiHandler.updateCurrentScore(this.currentScore);
    this.bombCount = INITIAL_BOMB_COUNT;
    this.nextBombScore = NEXT_BOMB_INCREMENT;
    this.uiHandler.updateBombCount(this.bombCount);

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
    createjs.Ticker.on("tick", this.tick);
  }

  tick(e) {
    this.keyHandler.handleTick(e);
    this.collisionHandler.checkCollisions(e);
    this.positionHandler.updatePositions(e);
    this.playSegmentStep(e);
    this.tickBombs(e);
    this.tickExplosions(e);
    this.tryAddBubble(e);
    this.tryAddCrab(e);
    this.tryAddShrimp(e);
    this.checkSounds();
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

  incrementBombCount() {
    if (this.bombCount < MAX_BOMB_COUNT) {
      this.uiHandler.updateBombCount(++this.bombCount);
      this.soundHandler.playBombIncrement();
    }
  }

  dropBomb() {
    if (!this.started || this.paused) return;
    if (this.bombCount > 0) {
      this.board.dropBomb();
      this.uiHandler.updateBombCount(--this.bombCount);
    }
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

  tickBombs(e) {
    if(e.paused) return;
    const bombIdxsToRemove = [];
    this.board.bombs.forEach((bomb, idx) => {
      bomb.tickDown();
      if (bomb.ticks === 0) {
        this.board.addExplosion(bomb.explode());
        bombIdxsToRemove.push(idx);
        this.soundHandler.playExplosionNoise();
      }
    });

    this.board.removeBombs(bombIdxsToRemove);
  }

  tickExplosions(e) {
    if(e.paused) return;
    const explosionIdxsToRemove = [];
    this.board.explosions.forEach((explosion, idx) => {
      explosion.tickDown();
      if (explosion.ticks === 0) {
        explosionIdxsToRemove.push(idx);
      }
    });

    this.board.removeExplosions(explosionIdxsToRemove);
  }

  tryAddBubble(e) {
    if (e.paused) return;
    const board = this.board;
    if ((createjs.Ticker.getTicks() % (FPS / 2) === 0)) {
      const x = this.stage.canvas.width * Math.random();
      const y = this.stage.canvas.height;
      const bubbleSize = BUBBLE_SIZES[Math.floor(Math.random() * 3)];
      const bubble = new Bubble({ x, y, bubbleSize });
      board.addBubble(bubble);
    }
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

  tryAddCrab(e) {
    if (e.paused) return;
    const board = this.board;
    if (this.started &&
        !board.crab &&
        (createjs.Ticker.getTicks() % (FPS / 2) === 0)) {
      const random = getRandomInt(0, 8);
      if (random <= this.level) {
        board.addCrab({
          maximumVelocity: CRAB_MIN_VELOCITY + (2 * this.level)
        });
        this.soundHandler.startCrabSequence();
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

  checkSounds() {
    if (this.soundHandler.shrimpOscillatorPlaying &&
        this.board.shrimp.length === 0) {
      this.soundHandler.stopShrimpOscillator();
    }
    if (this.soundHandler.crabSequencePlaying && !this.board.crab) {
      this.soundHandler.stopCrabSequence();
    }
  }

  incrementScore(addlScore) {
    this.currentScore += addlScore;
    this.uiHandler.updateCurrentScore(this.currentScore);

    if (this.currentScore >= this.nextBombScore) {
      this.incrementBombCount();
      this.nextBombScore += NEXT_BOMB_INCREMENT;
    }

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

  toggleMute() {
    const mute = this.soundHandler.toggleMute();
    Cookies.set(MUTE_COOKIE, mute);
    return mute;
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
