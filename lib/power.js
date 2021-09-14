const MovingObject = require("./moving_object.js");
const Util = require("./util.js");

const DEFAULTS = {
  COLOR: '#0a5aa1',
  RADIUS: 15,
  WAVE_WIDTH: 50,
  WAVE_HEIGHT: 40,
  SPEED: 1,
};

const waveImg = new Image ();
waveImg.src = 'lib/hqdefault.png';

// class vs function declaraction
// ES5 & ES6
class Power extends MovingObject {
  constructor(options = {}) {
    super(options)
    options.pos = options.pos || options.game.randomWavePosition();
    options.vel = options.vel || Util.randomVec(DEFAULTS.SPEED);
    options.radius = DEFAULTS.RADIUS;
    options.color = DEFAULTS.COLOR;
    options.image = waveImg.src;
    options.waveImg = document.getElementById('power');
    MovingObject.call(this, options);
  }

  drawWave(ctx) {
    ctx.drawImage(waveImg, this.pos[0], this.pos[1], 100, 100);
    // ctx.drawImage(waveImg, this.pos[0], this.pos[1]);
  }
}


// Util.inherits(Power, MovingObject);

console.log("wave", Power)

module.exports = Power;