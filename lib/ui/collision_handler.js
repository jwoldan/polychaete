
import Head from '../objects/head';

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
      this.checkSegmentDiverCollisions();
      this.checkSpiderCollisions();
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

  checkSpiderCollisions() {
    const game = this.game;
    const spider = this.board.spider;
    const spongeIdxsToRemove = [];

    if (spider) {
      if (spider.overlaps(this.board.diver)) {
        game.endGame();
      }
      this.board.sponges.forEach((sponge, spongeIdx) => {
        if (spider.overlaps(sponge)) {
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
        const spiderHit = this.checkLaserBeamSpiderCollisions(beam);
        if (spiderHit) {
          game.removeSpider();
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
          this.game.incrementScore(1);
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
        if (segments[i] instanceof Head) {
          game.incrementScore(100);
        } else {
          game.incrementScore(10);
        }
        this.soundHandler.playSegmentHit();
        return i;
      }
    }
    return false;
  }

  checkLaserBeamSpiderCollisions(beam) {
    const game = this.game;
    const spider = this.board.spider;
    if (spider && beam.overlaps(spider)) {
      if (spider.getY() > 500) {
        game.incrementScore(300);
      } else if (spider.getY() > 400) {
        game.incrementScore(600);
      } else {
        game.incrementScore(900);
      }
      this.soundHandler.playSpiderHit();
      return true;
    }
    return false;
  }

  checkLaserBeamShrimpCollisions(beam) {
    const shrimp = this.board.shrimp;
    for (let i = 0; i < shrimp.length; i++) {
      if (beam.overlaps(shrimp[i])) {
        this.game.incrementScore(200);
        this.soundHandler.playShrimpHit();
        return i;
      }
    }
    return false;
  }
}

export default CollisionHandler;