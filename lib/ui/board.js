import createjs from 'createjs';

import { FPS } from '../ui/sprite_sheets';

import { getRandomInt } from '../util/util';

import Diver from '../objects/diver';
import Head from '../objects/head';
import Segment, { LEFT, RIGHT } from '../objects/segment';
import SeaSponge from '../objects/sea_sponge';


class Board {

  constructor(options) {
    this.stage = options.stage;

    this.laserBeams = [];
    this.segments = [];
    this.sponges = [];

    this.setBackground();

    // this.addPolychaete = this.addPolychaete.bind(this);
    this.addBabyPolychaete = this.addBabyPolychaete.bind(this);
  }

  addDiver() {
    this.diver = new Diver();
    this.diver.setStage(this.stage);
    this.stage.addChild(this.diver.sprite);
  }

  setBackground() {
    const background = new createjs.Shape();
    background.graphics
      .beginFill('black')
      .drawRect(0, 0, this.stage.canvas.width, this.stage.canvas.height);
    this.stage.addChild(background);
    this.stage.setChildIndex(background, 0);
    this.stage.update();
  }

  addSeaSponges(numSponges) {
    let spongesPlaced = 0;

    while(spongesPlaced < numSponges) {
      const x = 16 * getRandomInt(0, 29);
      const y = 20 * getRandomInt(1, 29);

      let collision = false;
      this.sponges.forEach((sponge) => {
        if (sponge.getX() === x && sponge.getY() === y) {
          collision = true;
        }
      });

      if (!collision) {
        const sponge = new SeaSponge({ x, y });
        this.addSeaSponge(sponge);
        spongesPlaced++;
      }
    }
  }

  addPolychaete(length) {
    const startLeft = (Math.random() < .5);

    let headX;
    let direction;
    let xIncrement;
    if (startLeft) {
      headX = 0;
      direction = RIGHT;
      xIncrement = -16;
    } else {
      headX = this.stage.canvas.width - 16;
      direction = LEFT;
      xIncrement = 16;
    }

    const head = new Head({ x: headX, direction });
    this.addSegment(head);

    let lastSegment = head;
    for (let i = 1; i < length; i++) {
      const segment = new Segment({ x: headX + (xIncrement * i), direction });
      lastSegment.connectNext(segment);
      this.addSegment(segment);
      lastSegment = segment;
    }
  }

  addBabyPolychaete() {
    this.addPolychaete(1);
  }

  addSegment(segment) {
    segment.setStage(this.stage);
    this.stage.addChild(segment.sprite);
    this.segments.push(segment);
  }

  addSeaSponge(sponge) {
    sponge.setStage(this.stage);
    this.stage.addChild(sponge.sprite);
    this.sponges.push(sponge);
  }

  addLaserBeam(beam) {
    beam.setStage(this.stage);
    this.stage.addChild(beam.sprite);
    this.laserBeams.push(beam);
  }

  fireLaser() {
    this.addLaserBeam(this.diver.fireLaser());
  }

  removeSeaSpongeAtIdx(idx) {
    const sponge = this.sponges[idx];
    this.stage.removeChild(sponge.sprite);
    sponge.destroy();
    this.sponges.splice(idx, 1);
  }

  removeSegmentAtIdx(idx) {
    const segment = this.segments[idx];
    this.stage.removeChild(segment.sprite);
    segment.destroy();
    this.segments.splice(idx, 1);
  }

  removeLaserBeamAtIdx(idx) {
    const laserBeam = this.laserBeams[idx];
    this.stage.removeChild(laserBeam.sprite);
    laserBeam.destroy();
    this.laserBeams.splice(idx, 1);
  }


}

export default Board;