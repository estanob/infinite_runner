const InfiniteRunner = require('../lib/game.js');

const canvas = document.getElementById('game-canvas').setAttribute('width', '3000px').setAttribute('height', '5000px');
new InfiniteRunner(canvas);