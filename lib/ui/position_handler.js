class PositionHandler {

  constructor(game) {
    this.game = game;
    this.board = game.board;

    this.updatePositions  = this.updatePositions.bind(this);
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
    this.game.removeLaserBeams(laserIdxsToRemove);
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
    this.game.removeShrimp(shrimpIdxsToRemove);
  }

  updateSpiderPosition() {
    const spider = this.board.spider;
    if (spider) {
      spider.updatePosition();
      if (!spider.isPartiallyInMoveBounds()) this.game.removeSpider();
    }
  }

}

export default PositionHandler;
