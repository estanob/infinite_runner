const MovingObject = require("./moving_object.js");
const Util = require("./util.js");

const DEFAULTS = {
  COLOR: '#0a5aa1',
  RADIUS: 15,
  WAVE_WIDTH: 50,
  WAVE_HEIGHT: 40,
  SPEED: 1,
};

const Power = function (options = {}) {
  options.pos = options.pos || options.game.randomWavePosition();
  options.vel = options.vel || Util.randomVec(DEFAULTS.SPEED);
  options.radius = DEFAULTS.RADIUS;
  options.color = DEFAULTS.COLOR;
  MovingObject.call(this, options);
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