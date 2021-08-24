const MovingObject = require("./moving_object.js");
const Power = require('./power.js');
const Util = require("./util.js");

const head = document.getElementById("avatar");
const surfboard = document.getElementById("surfboard");

const DEFAULTS = {
  CHARACTER_WIDTH: 90,
  CHARACTER_HEIGHT: 100,
  COLOR: '#50b9d9',
  RADIUS: 20,
  SPEED: 1,
};

let Surfer = function (options) {
  options.color = DEFAULTS.COLOR;
  options.radius = DEFAULTS.RADIUS;
  options.pos = options.pos || [15,0]
  options.vel = options.vel || [0,0];
  options.head = head;
  options.surfboard = surfboard;
  options.x = 200;
  options.y = 200;
  options.spriteX = 0;
  options.spriteY = 35;
  options.spriteWidth = 90;
  options.spriteHeight = 70;

  MovingObject.call(this, options)
}

Util.inherits(Surfer, MovingObject);

Surfer.prototype.bounds = function () {
  return {
    left: this.x,
    right: this.x + DEFAULTS.CHARACTER_WIDTH,
    top: this.y,
    bottom: this.y + DEFAULTS.CHARACTER_HEIGHT,
  };
};

Surfer.prototype.drawSurfer = function (ctx) {
  const surfer = new Image();
  surfer.src = '../src/img/tumblr_a34e739e74509fc7166ec36de6fd31d9_4aada2e4_1280.png';
  ctx.drawImage(surfer, this.options.spriteX, this.options.spriteY, this.options.spriteWidth, this.options.spriteHeight, this.options.x, this.options.y, DEFAULTS.CHARACTER_WIDTH, DEFAULTS.CHARACTER_HEIGHT)
}

Surfer.prototype.animate = function (ctx) {
  this.drawSurfer(ctx);
  this.surf();
  this.waterBend()
}

Surfer.prototype.waterBend = function () {
  let waveVel = [1, 0];
  
  let wave = new Power({
    pos: this.pos,
    vel: waveVel,
    color: this.color,
    game: this.game,
  });
  this.game.waves.push(wave)
};

Surfer.prototype.surf = function (impulse) {
  this.vel[0] += impulse[0];
  this.vel[1] += impulse[1];
};

module.exports = Surfer;