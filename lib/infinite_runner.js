const GameView = require('./game_view.js');
const Game = require('./game.js');

document.addEventListener("DOMContentLoaded", function() {
  const splash = document.getElementById('splash')
  const startButton = document.getElementById('start')
  const gameContainer = document.getElementsByClassName("game-container")[0];
  const canvas = document.getElementById("game-canvas");
  canvas.setAttribute("width", "1200px")
  canvas.setAttribute("height", "550px")
  const ctx = canvas.getContext("2d");
  const g = new Game(canvas);
  const game = new GameView(g, ctx)
  // ctx.scale(0.5, 0.5)
  startButton.addEventListener("click", () => {
    splash.classList.add("hidden")
    gameContainer.classList.remove("hidden")
    game.start()
  })
  // new GameView(g, ctx).start();

});