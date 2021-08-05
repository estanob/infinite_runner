const Util = require('./util.js');
const Surfer = require('./surfer.js');
const Shark = require('./shark.js');

const Game = function() {
  this.sharks = [];
  this.whirlpools = [];

  this.addSharks();
}

Game.DIM_X = window.innerWidth;
Game.DIM_Y = window.innerHeight;
Game.NUM_SHARKS = 10;
Game.NUM_WHIRLPOOLS = 10; 

Game.prototype.moveSharks = function (delta) {
  this.allObjects().forEach(object => {
    object.move(delta);
  })
}

Game.prototype.addSurfer = function () {
  const surfer = new Surfer({
    pos: [0, 0],
    game: this,
  });

  return surfer;
};

Game.prototype.addSharks = function () {
  for (let i = 0; i < Game.NUM_SHARKS; i++) {
    this.sharks.push(new Shark({ game: this }));
  };
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

  this.allObjects().forEach(object => {
    object.draw(ctx)
  })

  ctx.clearRect(Game.DIM_X, 0, Game.DIM_X, Game.DIM_Y);
  ctx.clearRect(0, Game.DIM_Y, Game.DIM_X * 2, Game.DIM_Y);
};

Game.prototype.allObjects = function () {
  return [].concat(this.sharks, this.whirlpools);
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