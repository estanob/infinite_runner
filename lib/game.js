const Shark = require('./shark');

const Game = function() {
  this.sharks = [];
  this.whirlpools = [];

  this.addSharks();
}

Game.NUM_SHARKS = 10;

Game.prototype.addSharks = function () {
  for (let i = 0; i < Game.NUM_SHARKS; i++) {
    this.sharks.push(new Shark({ game: this }));
  };
};

module.exports = Game;