import createjs from 'createjs';

import Game from './ui/game';
import Head from './models/head';
import Segment from './models/segment';

document.addEventListener('DOMContentLoaded', () => {

  const stage = new createjs.Stage('canvas');

  const game = new Game({ stage });

  const head = new Head({ x: 112 });
  game.addSegment(head);


  for (let i = 0; i < 7; i++) {
    const segment = new Segment({ x: (16 * i) });
    head.connectNext(segment);
    game.addSegment(segment);
  }

  game.initialize();
  game.run();

});
