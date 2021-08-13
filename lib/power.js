const MovingObject = require("./moving_object.js");
const Util = require("./util.js");

const Power = function (options) {
  this.pos = options.pos;
  this.vel = options.vel;
  this.radius = options.radius;
  this.color = options.color;
  this.game = options.game;
}

MovingObject.prototype.moveBoard = function () {};
MovingObject.prototype.shootWave = function () {
  console.log("You have created a wave")
  const waterBendingWave = new Power({
    pos: this.game.surfer.pos,
    game: this.game,
  })
};

Util.inherits(Power, MovingObject);

module.exports = Power;