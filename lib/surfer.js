const MovingObject = require("./moving_object.js");
const Power = require('./power.js');
const Util = require("./util.js");
// const Resources = require('./resources.js');

const head = document.getElementById("avatar");
const surfboard = document.getElementById("surfboard");

var surferCanvas = document.getElementById("surfer");
if(surferCanvas) {
  surferCanvas.width = 100;
  surferCanvas.height = 100;
}

var surferCtx = surferCanvas ? surferCanvas.getContext('2d') : {};

const DEFAULTS = {
  CHARACTER_WIDTH: 90,
  CHARACTER_HEIGHT: 100,
  COLOR: '#50b9d9',
  RADIUS: 20,
  SPEED: 1,
};

const surferImg = new Image ();
surferImg.src = 'lib/tumblr_a34e739e74509fc7166ec36de6fd31d9_4aada2e4_1280.png';

let Surfer = function (options) {
  console.log("surfer img")
  console.log(surferImg.src)
  // surferImg.src = "https://surferbending.s3.us-west-1.amazonaws.com/tumblr_a34e739e74509fc7166ec36de6fd31d9_4aada2e4_1280.png";
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
  options.image = surferImg.src
  this.surferImg = document.getElementById('avatar');

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

Surfer.prototype.sprite = function (options) {
  let that = {};

  that.context = options.context;
  that.width = options.width;
  that.height = options.height;
  that.image = options.image;

  return that;
}

// Surfer.prototype.drawSurfer = function () {
Surfer.prototype.drawSurfer = function (ctx) {
  // console.log(options)
  // console.log(Resources)
  // let img = Resources.get(this.image);
  // const surfer = new Image();
  // surfer.src = surferImgUrl;
  // console.log(this.image)
  // if (surferCanvas) {
  //   surferCtx.drawImage(surferCanvas, 50, 50)
  // }
  console.log("surfer img")
  console.log(this.surferImg)
  ctx.drawImage(this.surferImg, 150, 250, 1200, 550)
  // if (surferImg.src) {
  //   ctx.drawImage(surferImg.src, 250, 150)
  // }
  // ctx.drawImage(this.image, this.x, this.y)
  console.log("Surfer has been drawn!")
  // ctx.drawImage(surferImg, 0, 0, ctx.spriteWidth, ctx.spriteHeight, ctx.x, ctx.y, DEFAULTS.CHARACTER_WIDTH, DEFAULTS.CHARACTER_HEIGHT)
  // ctx.drawImage(surferImg, ctx.spriteX, ctx.spriteY, ctx.spriteWidth, ctx.spriteHeight, ctx.x, ctx.y, DEFAULTS.CHARACTER_WIDTH, DEFAULTS.CHARACTER_HEIGHT)
}

Surfer.prototype.animate = function (ctx) {
  this.drawSurfer(ctx);
  // this.surf(ctx);
  // this.waterBend();
}

Surfer.prototype.waterBend = function () {
  console.log("Wave has been created")
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