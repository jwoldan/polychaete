class Game {

  constructor(options) {
    this.stage = options.stage;
    this.diver = options.diver;
    this.laserBeams = [];
    this.segments = [];

    this.updatePositions = this.updatePositions.bind(this);
    this.checkCollisions = this.checkCollisions.bind(this);
  }

  addSegment(segment) {
    this.segments.push(segment);
  }

  moveDiver(xDiff, yDiff) {
    this.diver.changeBoundedPos(xDiff, yDiff);
  }

  fireLaser() {
    this.laserBeams.push(this.diver.fireLaser());
  }

  updatePositions() {
    const idxsToRemove = [];

    this.laserBeams.forEach((beam, idx) => {
      beam.updatePosition();
      if (beam.getY() <= -beam.getHeight()) {
        idxsToRemove.push(idx);
      }
    });

    this.removeFromArray(this.laserBeams, idxsToRemove);
  }

  checkCollisions() {
    const beamIdxsToRemove = [];
    const segmentIdxsToRemove = [];

    this.laserBeams.forEach((beam, beamIdx) => {
      this.segments.forEach((segment, segmentIdx) => {
        if (beam.overlaps(segment)) {
          beamIdxsToRemove.push(beamIdx);
          segmentIdxsToRemove.push(segmentIdx);
        }
      });
    });

    this.removeFromArray(this.laserBeams, beamIdxsToRemove);
    this.removeFromArray(this.segments, segmentIdxsToRemove);
  }

  removeFromArray(array, idxsToRemove) {
    idxsToRemove.sort().reverse().forEach((idx) => {
      array[idx].destroySprite();
      array.splice(idx, 1);
    });
  }

  removeSegments(idxsToRemove) {

  }

}

export default Game;
