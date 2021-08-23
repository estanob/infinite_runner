const Util = require('./util.js');
const Surfer = require('./surfer.js');
const Shark = require('./shark.js');
const MovingObject = require('./moving_object.js');
const Power = require('./power.js');

let Game = function() {
  this.surfer;
  this.sharks = this.addSharks();
  this.whirlpools = [];
  this.waves = [];
  this.gameOver = false;
  this.powerDistance = 500;
  this.objects = this.allObjects();
  this.gameCanvas = document.getElementById("game-canvas");
  this.endScreen = document.getElementById("end-screen");
}

Game.DIM_X = 1200;
Game.DIM_Y = 550;
Game.NUM_SHARKS = Math.round(((1000 * Math.random()) * (100 * Math.random())));
Game.NUM_WHIRLPOOLS = 10; 

Game.prototype.surferStartPosition = function () {
  const DIM_X = 150;
  const DIM_Y = 250;
  return [DIM_X, DIM_Y];
};

Game.prototype.randomPosition = function () {
  const RAND_Y = Game.DIM_Y * Math.random() * Math.random();
  return [Game.DIM_X, RAND_Y];
};

Game.prototype.randomWavePosition = function () {
  const RAND_Y = Game.DIM_Y * Math.random() * Math.random();
  return [0, RAND_Y];
};

Game.prototype.moveSharks = function (delta) {
  this.allObjects().forEach((object, i) => {
    object.moveShark(delta)
  })
}

Game.prototype.moveWaves = function (delta) {
  this.waves.forEach(wave => {
    setTimeout(() => {
      wave.moveWave(delta)
    }, 350)
  })
}

Game.prototype.isOutOfBounds = function (pos) {
  return (
    (pos[0] < 0) ||
    (pos[1] < 0) ||
    (pos[0] > Game.DIM_X) ||
    (pos[1] > Game.DIM_Y)
  );
};

Game.prototype.remove = function (object) {
  if (object instanceof Shark) {
    this.sharks.splice(this.sharks.indexOf(object), 1);
  };
  if (object instanceof Power) {
    this.waves.splice(this.waves.indexOf(object), 1);
  };
  if (object instanceof Surfer) {
    this.surfer = {};
  }
};

Game.prototype.removeShark = function () {
  this.sharks.forEach(shark => {
    if (this.isOutOfBounds(shark.pos) || this.gameOver) this.remove(shark)
  })
}

Game.prototype.removeWave = function () {
  const allObjects = this.allObjects();
  allObjects.forEach(object => {
    if (object instanceof Power) {
      if (object.pos[0] > this.powerDistance) {
        this.remove(object)
      }
    }
  })
}

Game.prototype.removeSurfer = function () {
  const allObjects = this.allObjects();
  allObjects.forEach(object => {
    if (object instanceof Surfer) this.remove(object)
  })
}

Game.prototype.addSurfer = function () {
  const surfer = new Surfer({
    pos: this.surferStartPosition(),
    game: this,
  });

  this.surfer = surfer;
  return this.surfer;
};

Game.prototype.addSharks = function () {
  let sharks = [];
  for (let i = 0; i < Game.NUM_SHARKS; i++) {
    setTimeout(() => {
      sharks.push(
        new Shark({
          game: this,
          pos: this.randomPosition(),
        })
      )
    }, i * 1500)
  };
  return sharks;
};

Game.prototype.addWhirlpools = function () {
  for (let i = 0; i < Game.NUM_WHIRLPOOLS; i++) {
    this.whirlpools.push(new Whirlpool({ game: this }));
  };
};

Game.prototype.gameDraw = function (ctx) {
  ctx.clearRect(0, 0, Game.DIM_X, Game.DIM_Y);
  ctx.fillStyle = "#000000";
  ctx.fillRect(0, 0, Game.DIM_X, Game.DIM_Y);
  
  this.allObjects().forEach(object => {
    object.draw(ctx)
  })
};

Game.prototype.allObjects = function () {
  return [].concat(this.surfer, this.sharks, this.whirlpools, this.waves);
};

Game.prototype.step = function (delta) {
  this.moveSharks(delta);
  this.moveWaves(delta);
  this.surfer.moveSurfer(delta);
  this.checkCrash();
  this.removeWave();
  this.removeShark();
  this.powerUp();
  this.endGame();
};

Game.prototype.checkCrash = function () {
  const allObjects = this.allObjects();

  for (let i = 0; i < allObjects.length; i++) {
    for (let j = 0; j < allObjects.length; j++) {
      const obj1 = allObjects[i];
      const obj2 = allObjects[j];
      if (obj1.crashedWith(obj2) && obj1 instanceof Shark && obj2 instanceof Surfer) {
        alert("Game over.")
        this.gameOver = true;
        // return;
      } 
    }
  }

  for (let i = 0; i < allObjects.length; i++) {
    for (let j = 0; j < allObjects.length; j++) {
      let obj1 = allObjects[i];
      let obj2 = allObjects[j];
      if (obj1 instanceof Power && obj2 instanceof Shark) {
        if (obj1.crashedWith(obj2)) {
          obj1.remove()
          obj2.remove()
        }
      }
    }
  }
};

Game.prototype.powerUp = function () {
  if ((this.sharksHit >= (Game.NUM_SHARKS * .5)) && (this.sharksHit < (Game.NUM_SHARKS * .75))) {
    this.powerDistance = 600;
  } else if ((this.sharksHit >= (Game.NUM_SHARKS * .75)) && (this.sharksHit < (Game.NUM_SHARKS * .8))) {
    this.powerDistance = 650;
  } else if (this.sharksHit >= (Game.NUM_SHARKS * .8)) {
    this.powerDistance = 700;
  }
}

Game.prototype.endGame = function () {
  if (this.gameOver) {
    this.objects = [];
    this.gameCanvas.classList.add("hidden")
    this.endScreen.classList.remove("hidden")
  }
}

module.exports = Game;