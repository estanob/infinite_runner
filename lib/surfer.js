const MovingObject = require("./moving_object.js");
const Power = require('./power.js');
const Util = require("./util.js");

const DEFAULTS = {
  CHARACTER_WIDTH: 90,
  CHARACTER_HEIGHT: 100,
  // CHARACTER: ["Aang", "Kuruk", "Korra"]
  COLOR: '#50b9d9',
  RADIUS: 20,
  SPEED: 1,
};

let Surfer = function (options) {
  // options.character = DEFAULTS.CHARACTER[CHARACTER.length.random()],
  options.color = DEFAULTS.COLOR;
  options.radius = DEFAULTS.RADIUS;
  options.pos = options.pos || [15,0]
  options.vel = options.vel || [0,0];

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

Surfer.prototype.waterBend = function () {
  console.log(this.game)
  console.log("---")
  let norm = Util.norm(this.vel);
  // console.log("norm")
  // console.log(norm)
  // if (norm === 0) {
  //   return;
  // }

  console.log(this.vel)

  let relVel = Util.scale(Util.dir(this.vel), 2);
  console.log("rel vel")
  console.log(relVel)
  
  let waveVel = [1, 0];
  // let waveVel = [relVel[0] + this.vel[0], relVel[1] + this.vel[1]];
  
  console.log("wave velocity")
  console.log(waveVel)
  let wave = new Power({
    pos: this.pos,
    vel: waveVel,
    color: this.color,
    game: this.game,
  });
  console.log(wave)
  this.game.waves.push(wave)
  console.log(this.game)
};

Surfer.prototype.surf = function (impulse) {
  this.vel[0] += impulse[0];
  this.vel[1] += impulse[1];
};

module.exports = Surfer;