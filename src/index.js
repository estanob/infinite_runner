const Game = require('../lib/game.js');

window.addEventListener("DOMContentLoaded", () => {
  const splash = document.getElementById('splash')
  const startButton = document.getElementById('start')
  const gameContainer = document.getElementsByClassName("game-container");
  const canvas = document.getElementById('game-canvas').setAttribute('width', '900px').setAttribute('height', '650px');
  new Game(canvas);
  
  console.log(startButton)

  startButton.addEventListener("click", () => {
    console.log(splash)
    console.log(gameContainer)
    splash.classList.add("hidden")
    gameContainer.classList.remove("hidden")
  })
})