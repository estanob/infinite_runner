const Game = require('../lib/game.js');


const canvas = document.getElementById('game-canvas').setAttribute('width', '900px').setAttribute('height', '650px');
// const canvas = document.getElementById('game-canvas').setAttribute('width', '1500px').setAttribute('height', '650px');
// const canvas = document.getElementById('game-canvas').setAttribute('width', '3000px').setAttribute('height', '5000px');
new Game(canvas);

const pause = document.getElementById("pause-button");
pause.addEventListener("click", canvas.pauseGame);