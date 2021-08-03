const DEFAULTS = {
  SPEED: 1,
};

const Shark = function (options = {}) {
  options.pos = options.pos || options.game.randomPosition();
  options.vel = options.vel || Util.randomVec(DEFAULTS.SPEED);

  MovingObject.call(this, options);
};

module.exports = Shark;