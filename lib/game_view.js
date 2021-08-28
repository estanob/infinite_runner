const KeyMaster = require('../src/keymaster.js');
const Power = require('./power.js');
const Game = require('./game.js');
const Surfer = require('./surfer.js');
const Background = require('./background.js');

const GameView = function (game, ctx) {
  this.ctx = ctx;
  this.game = game;
  // this.surfer;
  // this.surfer = this.game.addSurfer();
};

const gameContainer = document.getElementById("game-container");
const canvas = document.getElementById("game-canvas");

GameView.MOVES = {
  "up": [0, -1],
  "down": [0, 1],
};

GameView.prototype.bindKeyHandlers = function () {
  const surfer = this.surfer;

  Object.keys(GameView.MOVES).forEach(k => {
    let move = GameView.MOVES[k];
    key(k, function () { surfer.surf(move) }) 
  })

  key("space", function () { surfer.waterBend() });
};

GameView.prototype.start = function () {
  this.backGround = new Background(this.ctx)
  this.surfer = new Surfer(this.ctx)
  this.game.score = 0;
  this.game.gameOver = false;
  this.bindKeyHandlers();
  this.lastTime = 0;
  requestAnimationFrame(this.animate.bind(this));
};

GameView.prototype.animate = function (time) {
  const delta = time - this.lastTime;

  this.game.gameDraw(this.ctx);
  this.backGround.drawBackground(this.ctx);
  this.lastTime = time;
  this.displaySharkInfo();
  this.surfer.drawSurfer(this.ctx)
  // this.surfer.animate(this.ctx)
  this.game.step(delta);
  requestAnimationFrame(this.animate.bind(this));
};

GameView.prototype.displaySharkInfo = function () {
  this.ctx.fillStyle ="#045080"
  this.ctx.font = "15px BlinkMacSystemFont,Roboto,Helvetica Neue,Arial,sans-serif"
  this.ctx.fillText("Number of Sharks:" + this.game.numSharks, 10, 20)
  this.ctx.fillText("Sharks Hit:" + this.game.sharksHit, 10, 40)
}

GameView.prototype.restart = function () {
  gameContainer.classList.remove("hidden")
  canvas.classList.remove("hidden")
  this.start();
}

module.exports = GameView;