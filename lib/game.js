const Util = require('./util.js');
const Surfer = require('./surfer.js');
const Shark = require('./shark.js');
const MovingObject = require('./moving_object.js');

let Game = function() {
  this.surfer;
  this.sharks = this.addSharks();
  this.whirlpools = [];

  // this.addSharks();
  // console.log(this.sharks);
}

Game.DIM_X = 1000;
Game.DIM_Y = 580;
// Game.DIM_X = window.innerWidth;
// Game.DIM_Y = window.innerHeight;
Game.NUM_SHARKS = 10;
Game.NUM_WHIRLPOOLS = 10; 

Game.prototype.surferStartPosition = function () {
  const DIM_X = 150;
  const DIM_Y = 250;
  return [DIM_X, DIM_Y];
};

Game.prototype.randomPosition = function () {
  const RAND_X = Game.DIM_X * Math.random() * Math.random();
  const RAND_Y = Game.DIM_Y * Math.random() * Math.random();
  // console.log([RAND_X, RAND_Y]);
  return [RAND_X, RAND_Y];
};

Game.prototype.moveSharks = function (delta) {
  this.allObjects().forEach(object => {
    object.move(delta);
  })
}

Game.prototype.isOutOfBounds = function (pos) {
  return (pos[0] < 0) ||
         (pos[1] < 0) ||
         (pos[0] > Game.DIM_X) ||
         (pos[1] > Game.DIM_Y);
        //  (pos[0] < Game.DIM_X) ||
        //  (pos[1] < Game.DIM_Y);
};

Game.prototype.remove = function (object) {
  if (object instanceof Shark) {
    this.sharks.splice(this.sharks.indexOf(object), 1);
  };
};

Game.prototype.addSurfer = function () {
  const surfer = new Surfer({
    pos: this.surferStartPosition(),
    game: this,
  });

  this.surfer = surfer;
  return surfer;
};

Game.prototype.addSharks = function () {
  let sharks = [];
  for (let i = 0; i < Game.NUM_SHARKS; i++) {
    // debugger
    sharks.push(
      new Shark({
        game: this,
        pos: this.randomPosition(),
      })
    );
  // this.sharks = ["hello"];
  };
  // debugger
  // console.log(this.sharks) 
  this.sharks = sharks;
  return this.sharks;
};

Game.prototype.addWhirlpools = function () {
  for (let i = 0; i < Game.NUM_WHIRLPOOLS; i++) {
    this.sharks.push(new Whirlpool({ game: this }));
  };
};

Game.prototype.draw = function (ctx) {
  ctx.clearRect(0, 0, Game.DIM_X, Game.DIM_Y);
  ctx.fillStyle = "#000000";
  ctx.fillRect(0, 0, Game.DIM_X, Game.DIM_Y);

  // console.log(this.game.sharks)
  
  this.allObjects().forEach(object => {
    // console.log(object)
    object.draw(ctx)
  })

  ctx.clearRect(Game.DIM_X, 0, Game.DIM_X, Game.DIM_Y);
  ctx.clearRect(0, Game.DIM_Y, Game.DIM_X * 2, Game.DIM_Y);
};

Game.prototype.allObjects = function () {
  // console.log(this.sharks);
  return [].concat(this.surfer, this.sharks, this.whirlpools);
};

Game.prototype.step = function (delta) {
  this.moveSharks(delta);
  this.checkCrash();
};

Game.prototype.checkCrash = function () {
  const allObjects = this.allObjects();

  for (let i = 0; i < allObjects.length; i++) {
    for (let j = 0; j < allObjects.length; j++) {
      const obj1 = allObjects[i];
      const obj2 = allObjects[j];

      if (obj1.crashedWith(obj2)) {
        const crash = obj1.crashWith(obj2);
        if (crash) {
          return;
        };
      };
    };
  };
};

module.exports = Game;