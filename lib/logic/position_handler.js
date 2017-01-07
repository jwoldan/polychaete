class PositionHandler {

  constructor(game) {
    this.game = game;
    this.board = game.board;
  }

  updatePositions(e) {
    if (e.paused) return;
    this.updateBubblePositions();
    this.updateLaserBeamPositions();
    this.updateSegmentPositions();
    this.updateShrimpPositions();
    this.updateCrabPosition();
    this.updateScorePosition();
  }

  updateBubblePositions() {
    const bubbles = this.board.bubbles;
    const bubbleIdxsToRemove = [];
    bubbles.forEach((bubble, idx) => {
      bubble.updatePosition();
      if (bubble.getY() <= -bubble.getHeight()) {
        bubbleIdxsToRemove.push(idx);
      }
    });
    this.board.removeBubbles(bubbleIdxsToRemove);
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
    this.board.removeLaserBeams(laserIdxsToRemove);
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
  }

  updateShrimpPositions() {
    const shrimps = this.board.shrimp;
    const shrimpIdxsToRemove = [];
    shrimps.forEach((shrimp, idx) => {
      shrimp.updatePosition();
      if (!shrimp.isPartiallyInMoveBounds()) {
        shrimpIdxsToRemove.push(idx);
      } else {
        if (Math.random() < .01) {
          const sponges = this.board.sponges;
          const segments = this.board.segments;
          let collided = false;
          sponges.forEach((sponge) => {
            if (shrimp.overlaps(sponge)) collided = true;
          });
          if (!collided) {
            segments.forEach((segment) => {
              if (shrimp.overlaps(segment)) collided = true;
            });
          }
          if (!collided &&
              (shrimp.moveBounds.maxY - shrimp.getY() > shrimp.getHeight())) {
            this.board.addSeaSponge(shrimp.dropSeaSponge());
          }
        }
      }
    });
    this.board.removeShrimp(shrimpIdxsToRemove);
  }

  updateCrabPosition() {
    const crab = this.board.crab;
    if (crab) {
      crab.updatePosition();
      if (!crab.isPartiallyInMoveBounds()) this.board.removeCrab();
    }
  }

  updateScorePosition() {
    const scores = this.board.scores;
    const scoreIdxsToRemove = [];
    scores.forEach((score, idx) => {
      if(score.getAlpha() <= 0) scoreIdxsToRemove.push(idx);
      else score.updatePosition();
    });
    this.board.removeScores(scoreIdxsToRemove);
  }

}

export default PositionHandler;
