const GameView = require('./game_view.js');
const Game = require('./game.js');

const canvas = document.getElementById("game-canvas");

// document.addEventListener("DOMContentLoaded", function() {
//   canvas.setAttribute("width", "1200px")
//   canvas.setAttribute("height", "550px")
// });

const startButton = document.getElementById('start')
const splash = document.getElementById('splash')
const gameContainer = document.getElementsByClassName("game-container")[0];


startButton.addEventListener("click", () => {
  canvas.setAttribute("width", "1200px")
  canvas.setAttribute("height", "550px")
  const ctx = canvas.getContext("2d");
  console.log("Shouldn't be double")
  splash.classList.add("hidden")
  gameContainer.classList.remove("hidden")
  new GameView(new Game(canvas), ctx).start()
  console.log("Why")
})