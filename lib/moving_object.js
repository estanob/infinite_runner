const Util = require('./util');

const MovingObject = function (options) {
  this.pos = options.pos;
  this.vel = options.vel;
  this.game = options.game;
};

MovingObject.prototype.collideWith = function (other) {};
MovingObject.prototype.isWrappable = true;

const TIME_DELTA = 1000 / 60;

MovingObject.prototype.move = function (delta) {
  const vel = delta / TIME_DELTA,
    moveX = this.vel[0] * vel,
    moveY = this.vel[1] * vel;

  this.pos = [this.pos[0] + moveX, this.pos[1] + moveY];

  if (this.game.isOutOfBounds(this.pos)) {
    this.remove();
  };
};

MovingObject.prototype.remove = function () {
  this.game.remove(this);
}

MovingObject.prototype.isCollidedWith = function (other) {
  const centerDist = Util.dist(this.pos, other.pos);
  return centerDist < (this.radius + other.radius);
};

module.exports = MovingObject;