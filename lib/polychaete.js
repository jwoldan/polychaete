import createjs from 'createjs';

import Game from './ui/game';
import Head from './objects/head';
import Segment from './objects/segment';

document.addEventListener('DOMContentLoaded', () => {

  const stage = new createjs.Stage('canvas');
  const currentScoreElement = document.getElementById('current-score');
  const highScoreElement = document.getElementById('high-score');

  const game = new Game({ stage, currentScoreElement, highScoreElement });

  game.initialize();
  game.run();

});
