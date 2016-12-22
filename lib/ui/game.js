class Game {

  constructor(options) {
    this.stage = options.stage;
    this.diver = options.diver;
    this.laserBeams = [];
    this.segments = [];
    this.sponges = [];

    this.updatePositions = this.updatePositions.bind(this);
    this.checkCollisions = this.checkCollisions.bind(this);
  }

  addSegment(segment) {
    this.segments.push(segment);
  }

  addSeaSponge(sponge) {
    this.sponges.push(sponge);
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
    const spongeIdxsToRemove = [];

    this.laserBeams.forEach((beam, beamIdx) => {
      this.segments.forEach((segment, segmentIdx) => {
        if (beam.overlaps(segment)) {
          beamIdxsToRemove.push(beamIdx);
          segmentIdxsToRemove.push(segmentIdx);
        }
      });
      this.sponges.forEach((sponge, spongeIdx) =>{
        if (beam.overlaps(sponge)) {
          beamIdxsToRemove.push(beamIdx);
          spongeIdxsToRemove.push(spongeIdx);
        }
      });
    });

    this.removeFromArray(this.laserBeams, beamIdxsToRemove);
    this.removeFromArray(this.segments, segmentIdxsToRemove);
    this.removeFromArray(this.sponges, spongeIdxsToRemove);
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
