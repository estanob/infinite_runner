const Util = require('./util.js');
const MovingObject = require('./moving_object.js');

const DEFAULTS = {
  SPEED: 1,
};

const Shark = function (options = {}) {
  options.pos = options.pos || options.game.randomPosition();
  options.vel = options.vel || Util.randomVec(DEFAULTS.SPEED);

  MovingObject.call(this, options);
};

Util.inherits(Shark, MovingObject);

module.exports = Shark;