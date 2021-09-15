const MovingObject = require("./moving_object.js");
const Power = require('./power.js');
const Util = require("./util.js");

const DEFAULTS = {
  CHARACTER_WIDTH: 90,
  CHARACTER_HEIGHT: 100,
  COLOR: '#50b9d9',
  RADIUS: 20,
  SPEED: 1,
};

const surferImg = new Image ();
surferImg.src = 'lib/main-qimg-9051717fa22925b5af3ee924dc6c5491.png';
// surferImg.src = 'lib/tumblr_a34e739e74509fc7166ec36de6fd31d9_4aada2e4_1280.png';

const Surfer = function (options) {
  options.color = DEFAULTS.COLOR;
  options.radius = DEFAULTS.RADIUS;
  options.pos = options.pos || [150,250]
  options.vel = options.vel || [0,0];
  options.x = 200;
  options.y = 200;
  options.spriteX = 0;
  options.spriteY = 35;
  options.spriteWidth = 90;
  options.spriteHeight = 70;
  options.image = surferImg.src
  options.surferImg = document.getElementById('avatar');
  MovingObject.call(this, options)
}

Util.inherits(Surfer, MovingObject);

Surfer.prototype.bounds = function () {
  return {
    left: this.x,
    right: this.x + DEFAULTS.CHARACTER_WIDTH,
    top: this.y,
    bottom: this.y - DEFAULTS.CHARACTER_HEIGHT,
  };
};

Surfer.prototype.sprite = function (options) {
  let that = {};

  that.context = options.context;
  that.width = options.width;
  that.height = options.height; 
  that.image = options.image;

  return that;
}

Surfer.prototype.drawSurfer = function (ctx) {
  ctx.drawImage(surferImg, this.pos[0], this.pos[1], 100, 100)
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