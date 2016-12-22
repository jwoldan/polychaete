import createjs from 'createjs';

import Game from './ui/game';
import Head from './models/head';
import Segment from './models/segment';

document.addEventListener('DOMContentLoaded', () => {

  const stage = new createjs.Stage('canvas');

  const head = new Head({ x: 16 });
  const segment = new Segment({ x: 0 });

  const game = new Game({ stage });
  game.initialize();
  game.run();
  game.addSegment(head);
  game.addSegment(segment);

});
