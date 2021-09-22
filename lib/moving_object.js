const Util = require('./util.js');

const MovingObject = function (options) {
  this.pos = options.pos;
  this.vel = options.vel;
  this.radius = options.radius;
  this.color = options.color;
  this.game = options.game;
};

const TIME_DELTA = 1000 / 60;

MovingObject.prototype.draw = function (ctx) {
  ctx.fillStyle = this.color;
  ctx.beginPath();
  ctx.arc(this.pos[0], this.pos[1], this.radius, 0, 2 * Math.PI, false);
  ctx.fill();
}

MovingObject.prototype.moveIceberg = function (delta) {
  if (this.game.icebergs.length > 0) {
    const vel = delta / TIME_DELTA;
    const moveX = this.vel[0] * vel * (5 * Math.random());

    if (moveX < this.vel[0]) {
      this.pos = [this.pos[0] + moveX, this.pos[1]];
    }

    if (this.game.isOutOfBounds(this.pos)) {
      this.vel[0] = this.vel[0];
      this.vel[1] = this.vel[1];
    };
  }
};

MovingObject.prototype.moveWave = function (delta) {
  if (this.game.waves.length > 0) {
    const vel = delta / TIME_DELTA;
    const moveX = this.vel[0] * vel;

    console.log("The wave's move", moveX)

    if (moveX > this.vel[0]) {
      setTimeout(() => {
        this.pos = [this.pos[0] + moveX, this.pos[1]];
      }, 1000)
    }
  }
}

MovingObject.prototype.moveSurfer = function (delta) {
  const vel = delta / TIME_DELTA;
  const moveX = this.vel[0] * vel;
  const moveY = this.vel[1] * vel;
  
  this.pos = [this.pos[0] + moveX, this.pos[1] + moveY];

  if (this.game.isOutOfBounds(this.pos)) {
    this.vel[0] = 0;
    this.vel[1] = 0;
  };
};

MovingObject.prototype.remove = function () {
  this.game.remove(this);
}

MovingObject.prototype.crashedWith = function (other) {
  const centerDist = Util.dist(this.pos, other.pos);
  return centerDist < (this.radius + other.radius);
};

module.exports = MovingObject;