const GameView = require('./game_view.js');
const Game = require('./game.js');

const canvas = document.getElementById("game-canvas")
const ctx = canvas.getContext("2d");

if (canvas) {
  canvas.setAttribute("width", "1200px")
  canvas.setAttribute("height", "550px")
}

const startButton = document.getElementById('start');
const splash = document.getElementById('splash');
const g = new Game(canvas);
const game = new GameView(g, ctx)
const gameContainer = document.getElementById("game-container");

if (startButton) {
  startButton.addEventListener("click", () => {
    splash.classList.add("hidden");
    gameContainer.classList.remove("hidden");
    game.start();
  });
}