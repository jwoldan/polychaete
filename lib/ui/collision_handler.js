
import Head from '../objects/head';
import Score from '../objects/score';

import {
  SPONGE_HIT_SCORE,
  HEAD_HIT_SCORE,
  SEGMENT_HIT_SCORE,
  CRAB_HIT_SCORE_CLOSE,
  CRAB_HIT_SCORE_MIDDLE,
  CRAB_HIT_SCORE_FAR,
  SHRIMP_HIT_SCORE,
} from './scores';

class CollisionHandler {

  constructor(game) {
    this.game = game;
    this.board = game.board;
    this.soundHandler = game.soundHandler;

    this.checkCollisions = this.checkCollisions.bind(this);
  }

  checkCollisions(e) {
    const game = this.game;
    if (e.paused) return;
    if (game.started) {
      this.checkExplosionCollisions();
      this.checkSegmentDiverCollisions();
      this.checkCrabCollisions();
      this.checkShrimpDiverCollisions();
    }
    if (game.started) {
      this.checkLaserBeamCollisions();
    }
    if (game.started) {
      game.tryAddPolychaete();
    }
  }

  checkSegmentDiverCollisions() {
    this.board.segments.forEach((segment) => {
      if (segment.overlaps(this.board.diver)) {
        this.game.endGame();
      }
    });
  }

  checkCrabCollisions() {
    const game = this.game;
    const crab = this.board.crab;
    const spongeIdxsToRemove = [];

    if (crab) {
      if (crab.overlaps(this.board.diver)) {
        game.endGame();
      }
      this.board.sponges.forEach((sponge, spongeIdx) => {
        if (crab.overlaps(sponge)) {
          spongeIdxsToRemove.push(spongeIdx);
        }
      });
      game.removeSeaSponges(spongeIdxsToRemove);
    }
  }

  checkShrimpDiverCollisions() {
    this.board.shrimp.forEach((shrimp) => {
      if (shrimp.overlaps(this.board.diver)) {
        this.game.endGame();
      }
    });
  }

  checkLaserBeamCollisions() {
    const game = this.game;
    const laserBeams = this.board.laserBeams;
    const beamIdxsToRemove = [];
    const spongeIdxsToRemove = [];
    const segmentIdxsToRemove = [];
    const shrimpIdxsToRemove = [];

    laserBeams.forEach((beam, beamIdx) => {
      // only allow a laser beam a single hit
      let hit = false;

      const spongeIdx = this.checkLaserBeamSpongeCollisions(beam);
      if (spongeIdx !== false) {
        if (spongeIdx !== true) {
          spongeIdxsToRemove.push(spongeIdx);
        }
        beamIdxsToRemove.push(beamIdx);
        hit = true;
      }

      if (!hit) {
        const segmentIdx = this.checkLaserBeamSegmentCollisions(beam);
        if (segmentIdx !== false) {
          segmentIdxsToRemove.push(segmentIdx);
          beamIdxsToRemove.push(beamIdx);
          hit = true;
        }
      }

      if (!hit) {
        const crabHit = this.checkLaserBeamCrabCollisions(beam);
        if (crabHit) {
          game.removeCrab();
          beamIdxsToRemove.push(beamIdx);
          hit = true;
        }
      }

      if (!hit) {
        const shrimpIdx = this.checkLaserBeamShrimpCollisions(beam);
        if (shrimpIdx !== false) {
          shrimpIdxsToRemove.push(shrimpIdx);
          beamIdxsToRemove.push(beamIdx);
          hit = true;
        }
      }
    });

    game.removeLaserBeams(beamIdxsToRemove);
    game.removeSeaSponges(spongeIdxsToRemove);
    game.removeSegments(segmentIdxsToRemove);
    game.removeShrimp(shrimpIdxsToRemove);
  }

  checkLaserBeamSpongeCollisions(beam) {
    const sponges = this.board.sponges;
    for (let i = 0; i < sponges.length; i++) {
      if (beam.overlaps(sponges[i])) {
        sponges[i].handleHit();
        if(sponges[i].hits === 0) {
          this.game.incrementScore(SPONGE_HIT_SCORE);
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
    const game = this.game;
    const segments = this.board.segments;
    for (let i = 0; i < segments.length; i++) {
      if (beam.overlaps(segments[i])) {
        let score = SEGMENT_HIT_SCORE;
        if (segments[i] instanceof Head) {
          score = HEAD_HIT_SCORE;
        }
        game.incrementScore(score);
        this.board.addScore(Score.createScoreAboveObject(segments[i], score));
        this.soundHandler.playSegmentHit();
        return i;
      }
    }
    return false;
  }

  checkLaserBeamCrabCollisions(beam) {
    const game = this.game;
    const crab = this.board.crab;
    if (crab && beam.overlaps(crab)) {
      let score = CRAB_HIT_SCORE_FAR;
      if (crab.getY() <= 500 && crab.getY() > 400) {
        score = CRAB_HIT_SCORE_MIDDLE;
      } else if (crab.getY() > 500) {
        score = CRAB_HIT_SCORE_CLOSE;
      }
      game.incrementScore(score);
      this.board.addScore(Score.createScoreAboveObject(crab, score));
      this.soundHandler.playCrabHit();
      return true;
    }
    return false;
  }

  checkLaserBeamShrimpCollisions(beam) {
    const shrimp = this.board.shrimp;
    for (let i = 0; i < shrimp.length; i++) {
      if (beam.overlaps(shrimp[i])) {
        this.game.incrementScore(SHRIMP_HIT_SCORE);
        this.board.addScore(
          Score.createScoreAboveObject(shrimp[i], SHRIMP_HIT_SCORE)
        );
        this.soundHandler.playShrimpHit();
        return i;
      }
    }
    return false;
  }

  checkExplosionCollisions() {
    const game = this.game;
    const explosions = this.board.explosions;
    const sponges = this.board.sponges;
    const segments = this.board.segments;
    const shrimps = this.board.shrimp;
    const crab = this.board.crab;
    const spongeIdxsToRemove = [];
    const segmentIdxsToRemove = [];
    const shrimpIdxsToRemove = [];

    explosions.forEach((explosion) => {
      if (explosion.overlaps(this.board.diver)) {
        game.endGame();
      }

      if (game.started) {
        let score;

        if (crab) {
          if (explosion.overlaps(crab)) {
            score = CRAB_HIT_SCORE_CLOSE / 2;
            this.board.addScore(Score.createScoreAboveObject(crab, score));
            game.incrementScore(score);
            game.removeCrab();
          }
        }
        sponges.forEach((sponge, idx) => {
          if (explosion.overlaps(sponge)) {
            spongeIdxsToRemove.push(idx);
          }
        });
        segments.forEach((segment, idx) => {
          if (explosion.overlaps(segment)) {
            segmentIdxsToRemove.push(idx);
            if (segment instanceof Head) {
             score = HEAD_HIT_SCORE / 2;
            } else {
              score = SEGMENT_HIT_SCORE / 2;
            }
            this.board.addScore(Score.createScoreAboveObject(segment, score));
            game.incrementScore(score);
          }
        });
        shrimps.forEach((shrimp, idx) => {
          if (explosion.overlaps(shrimp)) {
            shrimpIdxsToRemove.push(idx);
            score = SHRIMP_HIT_SCORE / 2;
            this.board.addScore(Score.createScoreAboveObject(shrimp, score));
            game.incrementScore(score);
          }
        });
      }
    });

    game.removeSeaSponges(spongeIdxsToRemove);
    game.removeSegments(segmentIdxsToRemove, false);
    game.removeShrimp(shrimpIdxsToRemove);
  }

}

export default CollisionHandler;
