const MovingObject = require("./moving_object.js");
const Power = require('./power.js');
const Util = require("./util.js");

const DEFAULTS = {
  CHARACTER_WIDTH: 90,
  CHARACTER_HEIGHT: 100,
  COLOR: '#50b9d9',
  RADIUS: 15, // size is affecting collision check
  SPEED: 1,
};

const surferImg = new Image ();
surferImg.src = 'lib/main-qimg-9051717fa22925b5af3ee924dc6c5491.png';

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
  
  if (this.game.waves.length - 1 < this.game.bendingPower) {
    const startPos = this.pos;
    let wave = new Power({
      originalPos: startPos,
      pos: [this.pos[0] + 100, this.pos[1]],
      vel: waveVel,
      color: this.color,
      game: this.game,
    });
    
    setTimeout(() => {
      this.game.waves.push(wave)
    }, 1000 * this.game.waves.length)
  }
};

Surfer.prototype.surf = function (impulse) {
  this.vel[0] += impulse[0];
  this.vel[1] += impulse[1];
};

Surfer.prototype.stopWave = function () {
  if (this.game.waves.length > 0) {
    const surferPos = this.pos;
    this.game.waves.find(wave => {
      const wavePos = wave.pos;
      if (Math.abs(wavePos[0] - surferPos[0]) <= 300 && Math.abs(wavePos[1] - surferPos[1]) <= 300) {
        this.game.remove(wave);
      }
    })
  }
}

Surfer.prototype.killWaves = function () {
  if (this.game.waves.length > 0) {
    if (this.game.icebergsPassed > (this.game.numIcebergs * 0.5)) {
      this.game.waves = [];
    } else if (this.game.icebergsHit > 0 && this.game.icebergsPassed > (this.game.numIcebergs * Math.floor((Math.random() * (0.025 - 0.0001 + 1) + 0.0001))) && this.game.icebergsHit % 5 !== 3) {
      this.game.waves = [];
    }
  }
}

module.exports = Surfer;