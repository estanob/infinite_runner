const Util = require('./util.js');
const Surfer = require('./surfer.js');
const Iceberg = require('./iceberg.js');
const MovingObject = require('./moving_object.js');
const Power = require('./power.js');

let Game = function (ctx) {
  this.surfer = {};
  // this.surfer = this.addSurfer();
  this.icebergs = [];
  // this.icebergs = this.addIcebergs();
  this.whirlpools = [];
  this.waves = [];
  this.gameOver = false;
  this.powerDistance = 500;
  this.objects = this.allObjects();
  this.gameCanvas = document.getElementById("game-canvas") ? document.getElementById("game-canvas") : {};
  this.endScreen = document.getElementById("end-screen") ? document.getElementById("end-screen") : {};
  this.numIcebergs = Game.NUM_ICEBERGS;
  this.icebergsHit = 0;
  this.ctx = ctx;
}

Game.DIM_X = 1200;
Game.DIM_Y = 550;
Game.NUM_ICEBERGS = 100;
// Game.NUM_ICEBERGS = Math.round(((1000 * Math.random()) * (100 * Math.random())));
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

Game.prototype.moveIcebergs = function (delta) {
  this.allObjects().forEach(object => {
    object.moveIceberg(delta)
  })
}

Game.prototype.moveWaves = function (delta) {
  this.waves.forEach(wave => {
    setTimeout(() => {
      wave.moveWave(delta)
    }, 1500)
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
  if (object instanceof Iceberg) {
    this.icebergs.splice(this.icebergs.indexOf(object), 1);
  };
  if (object instanceof Power) {
    this.waves.splice(this.waves.indexOf(object), 1);
  };
  if (object instanceof Surfer) {
    this.surfer = {};
  }
};

Game.prototype.removeIceberg = function () {
  this.icebergs.forEach(iceberg => {
    if (this.isOutOfBounds(iceberg.pos) || this.gameOver) this.remove(iceberg)
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

Game.prototype.addIcebergs = function () {
  let icebergs = [];
  for (let i = 0; i < Game.NUM_ICEBERGS; i++) {
    setTimeout(() => {
      icebergs.push(
        new Iceberg({
          game: this,
          pos: this.randomPosition(),
        })
      )
    }, i * 1500)
  };
  // for (let i = 0; i < Game.NUM_ICEBERGS; i++) {
  //   setTimeout(() => {
  //     icebergs.push(
  //       new Iceberg({
  //         game: this,
  //         pos: this.randomPosition(),
  //       })
  //     )
  //   }, i * 1500)
  // };
  return icebergs;
};

Game.prototype.addWhirlpools = function () {
  for (let i = 0; i < Game.NUM_WHIRLPOOLS; i++) {
    this.whirlpools.push(new Whirlpool({ game: this }));
  };
};

Game.prototype.gameDraw = function (ctx) {
  ctx.clearRect(0, 0, Game.DIM_X, Game.DIM_Y);
  // ctx.fillStyle = "#000000";
  ctx.fillRect(0, 0, Game.DIM_X, Game.DIM_Y);
  this.allObjects().forEach(object => {
    object.draw(ctx)
  })
};

Game.prototype.allObjects = function () {
  return [].concat(this.surfer, this.icebergs, this.whirlpools, this.waves);
};

Game.prototype.step = function (delta) {
  // this.moveIcebergs(delta);
  this.moveWaves(delta);
  // this.surfer.surf(delta);
  // this.surfer.waterBend();
  this.surfer.drawSurfer(this.ctx)
  this.surfer.moveSurfer(delta, this.surfer.vel, this.surfer.pos);
  this.checkCrash();
  this.removeWave();
  // this.removeIceberg();
  this.powerUp();
  this.endGame();
};

Game.prototype.checkCrash = function () {
  const allObjects = this.allObjects();

  for (let i = 0; i < allObjects.length; i++) {
    for (let j = 0; j < allObjects.length; j++) {
      const obj1 = allObjects[i];
      const obj2 = allObjects[j];
      if (obj1.crashedWith(obj2) && obj1 instanceof Iceberg && obj2 instanceof Surfer) {
        alert("Game over.")
        this.gameOver = true;
      } 
    }
  }

  for (let i = 0; i < allObjects.length; i++) {
    for (let j = 0; j < allObjects.length; j++) {
      let obj1 = allObjects[i];
      let obj2 = allObjects[j];
      if (obj1 instanceof Power && obj2 instanceof Iceberg) {
        if (obj1.crashedWith(obj2)) {
          obj1.remove()
          obj2.remove()
          this.icebergsHit++
        }
      }
    }
  }
};

Game.prototype.powerUp = function () {
  if ((this.icebergsHit >= (Game.NUM_ICEBERGS * .5)) && (this.icebergsHit < (Game.NUM_ICEBERGS * .75))) {
    this.powerDistance = 600;
    alert("Your waves can reach further now!")
  } else if ((this.icebergsHit >= (Game.NUM_ICEBERGS * .75)) && (this.icebergsHit < (Game.NUM_ICEBERGS * .8))) {
    this.powerDistance = 650;
    alert("Your waves can reach further now!")
  } else if (this.icebergsHit >= (Game.NUM_ICEBERGS * .8)) {
    this.powerDistance = 700;
    alert("Your waves can reach further now!")
  }
}

Game.prototype.endGame = function () {
  if (this.gameOver) {
    this.objects = [];
    this.icebergsHit = 0;
    this.gameCanvas.classList.add("hidden")
    this.endScreen.classList.remove("hidden")
  }
}

module.exports = Game;