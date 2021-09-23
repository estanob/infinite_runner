const Util = require('./util.js');
const MovingObject = require('./moving_object.js');

const DEFAULTS = {
  COLOR: "#888c89",
  WIDTH: 120,
  HEIGHT: 120,
  RADIUS: 60,
  SPEED: 1,
};

const icebergImg = new Image ();
icebergImg.src = 'lib/Iceberg_spikes.png';

class IceBerg extends MovingObject {
  constructor(options = {}) {
    super(options)
    options.pos = options.pos || options.game.randomPosition();
    options.vel = options.vel || Util.randomVec(DEFAULTS.SPEED);
    options.color = DEFAULTS.COLOR;
    options.radius = DEFAULTS.RADIUS;
    options.x = 200;
    options.y = 200;
    options.spriteX = 0;
    options.spriteY = 35;
    options.spriteWidth = 90;
    options.spriteHeight = 70;
    options.image = icebergImg.src;
    this.icebergImg = document.getElementById('iceberg');
    MovingObject.call(this, options);
  }
  bounds() {
    return {
      left: this.x,
      right: this.x + DEFAULTS.WIDTH,
      top: this.y,
      bottom: this.y + DEFAULTS.HEIGHT,
    };
  }
  drawIceberg(ctx) {
    ctx.drawImage(this.icebergImg, this.pos[0], this.pos[1], 120, 120);
  }
}

module.exports = IceBerg;