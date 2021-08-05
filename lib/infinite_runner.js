const GameView = require('./game_view.js');
const Game = require('./game.js');

document.addEventListener("DOMContentLoaded", function() {
  const canvasEl = document.getElementsByTagName("canvas")[0];
  canvasEl.height = window.innerHeight - 100;
  canvasEl.width = window.innerWidth - 100;

  const ctx = canvasEl.getContext("2d");
  const g = new Game();
  new GameView(g, ctx).start();
});