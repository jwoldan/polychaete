import createjs from 'createjs';

import Game from './ui/game';
import Head from './objects/head';
import Segment from './objects/segment';

document.addEventListener('DOMContentLoaded', () => {

  const stage = new createjs.Stage('canvas');

  const game = new Game({ stage });

  game.initialize();
  game.run();

});
