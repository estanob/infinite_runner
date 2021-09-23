document.addEventListener('DOMContentLoaded', () => {
  const GameView = require('./game_view.js');
  const Game = require('./game.js');
  
  const canvas = document.getElementById("game-canvas");
  const ctx = canvas ? canvas.getContext("2d") : {};
  
  if (canvas) {
    canvas.setAttribute("width", "1200px");
    canvas.setAttribute("height", "550px");
  }
  
  const continueButton = document.getElementById('continue');
  const startButton = document.getElementById('start');
  const restartButton = document.getElementById('restart');
  const splash = document.getElementById('splash');
  const instructions = document.getElementById('game-explanation');
  const endScreen = document.getElementById("end-screen");
  const winScreen = document.getElementById("win-screen");
  const g = new Game(ctx);
  const game = new GameView(g, ctx)
  const gameContainer = document.getElementById("game-container");
  
  console.log("entry file", g);
  
  if (startButton) {
    startButton.addEventListener("click", () => {
      splash.classList.add("hidden");
      instructions.classList.remove("hidden");
    })
  }
  
  if (continueButton) {
    continueButton.addEventListener("click", () => {
      instructions.classList.add("hidden");
      gameContainer.classList.remove("hidden");
      canvas.classList.remove("hidden");
      game.start();
    });
  }
  
  if (restartButton) {
    restartButton.addEventListener("click", () => {
      window.location.reload()
      if (winScreen.classList.contains("hidden")) {
        endScreen.classList.add("hidden");
      }
      if (endScreen.classList.contains("hidden")) {
        winScreen.classList.add("hidden");
      }
      gameContainer.classList.remove("hidden");
      game.restart();
    });
  }
})