const GameView = require('./game_view.js');
const Game = require('./game.js');

const canvas = document.getElementById("game-canvas")//.setAttribute("width", "1200px").setAttribute("height", "550px");

if (canvas) {
  canvas.setAttribute("width", "1200px")
  canvas.setAttribute("height", "550px")
}

const startButton = document.getElementById('start');
const splash = document.getElementById('splash');
const gameContainer = document.getElementsByClassName("game-container")[0];


if (startButton) {
  startButton.addEventListener("click", () => {
    const ctx = canvas.getContext("2d");
    splash.classList.add("hidden");
    gameContainer.classList.remove("hidden");
    new GameView(new Game(canvas), ctx).start();
  });
}