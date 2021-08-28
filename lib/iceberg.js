const Util = require('./util.js');
const MovingObject = require('./moving_object.js');

const DEFAULTS = {
  COLOR: "#102de6",
  WIDTH: 80,
  HEIGHT: 90,
  RADIUS: 15,
  SPEED: 1,
};

const Iceberg = function (options = {}) {
  options.pos = options.pos || options.game.randomPosition();
  options.vel = options.vel || Util.randomVec(DEFAULTS.SPEED)
  options.color = DEFAULTS.COLOR;
  options.radius = DEFAULTS.RADIUS;
  MovingObject.call(this, options);
};

Iceberg.prototype.bounds = function () {
  return {
    left: this.x,
    right: this.x + DEFAULTS.WIDTH,
    top: this.y,
    bottom: this.y + DEFAULTS.HEIGHT,
  };
};

Util.inherits(Iceberg, MovingObject)

module.exports = Iceberg;