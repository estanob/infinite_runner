const Util = require('./util.js');
const Surfer = require('./surfer.js');
const Iceberg = require('./iceberg.js');
const MovingObject = require('./moving_object.js');
const Power = require('./power.js');

class Game {
  constructor(ctx) {
    this.surfer = {};
    this.icebergs = [];
    this.waves = [];
    this.gameOver = false;
    this.gameWon = false;
    this.powerDistance = 500;
    this.objects = this.allObjects();
    this.gameCanvas = document.getElementById("game-canvas") ? document.getElementById("game-canvas") : {};
    this.endScreen = document.getElementById("end-screen") ? document.getElementById("end-screen") : {};
    this.winScreen = document.getElementById("win-screen") ? document.getElementById("win-screen") : {};
    this.numIcebergs = Game.NUM_ICEBERGS;
    this.icebergsHit = 0;
    this.ctx = ctx;
    console.log(this)
  }
  
  surferStartPosition() {
    const DIM_X = 150;
    const DIM_Y = 250;
    return [DIM_X, DIM_Y];
  }
  
  randomPosition() {
    const RAND_Y = Game.DIM_Y * Math.random() * Math.random();
    return [Game.DIM_X, RAND_Y];
  }
  
  randomWavePosition() {
    const RAND_Y = Game.DIM_Y * Math.random() * Math.random();
    return [0, RAND_Y];
  }
  
  moveIcebergs(delta) {
    this.allObjects().forEach(object => {
      object.moveIceberg(delta);
    });
  }
  
  moveWaves(delta) {
    this.waves.forEach(wave => {
      setTimeout(() => {
        wave.moveWave(delta);
      }, 500)
    });
  }
  
  isOutOfBounds(pos) {
    return (
      (pos[0] < 0) ||
      (pos[1] < 0) ||
      (pos[0] > Game.DIM_X) ||
      (pos[1] > Game.DIM_Y - 100)
    );
  }
  
  remove(object) {
    if (object instanceof Iceberg) {
      this.icebergs.splice(this.icebergs.indexOf(object), 1);
    };
    if (object instanceof Power) {
      this.waves.splice(this.waves.indexOf(object), 1);
    };
    if (object instanceof Surfer) {
      this.surfer = {};
    }
  }
  
  removeIceberg() {
    this.icebergs.forEach(iceberg => {
      if (this.isOutOfBounds(iceberg.pos) || this.gameOver) {
        iceberg.remove();
          if (this.icebergs.length === 0) {
            this.gameWon = true;
          }
      }
    });
  }
  
  removeWave() {
    const allObjects = this.allObjects();
    allObjects.forEach(object => {
      if (object instanceof Power) {
        if (object.pos[0] > this.powerDistance) {
          this.remove(object);
        }
      }
    });
  }
  
  removeSurfer() {
    const allObjects = this.allObjects();
    allObjects.forEach(object => {
      if (object instanceof Surfer)
        this.remove(object);
    });
  }
  
  addSurfer() {
    const surfer = new Surfer({
      pos: this.surferStartPosition(),
      game: this,
    });
    this.surfer = surfer;
    return this.surfer;
  }
  
  addIcebergs() {
    let icebergs = [];
    for (let i = 0; i < Game.NUM_ICEBERGS; i++) {
      icebergs.push(
        new Iceberg({
          game: this,
          pos: this.randomPosition(),
        })
      );
    };
    this.icebergs = icebergs
    return this.icebergs;
  }
  
  gameDraw(ctx) {
    this.allObjects().forEach(object => {
      if (object instanceof Power) {
        object.drawWave(ctx)
      } else if (object instanceof Surfer) {
        object.drawSurfer(ctx)
      } else if (object instanceof Iceberg) {
        object.drawIceberg(ctx)
      }
    });
  }
  
  allObjects() {
    return [].concat(this.surfer, this.icebergs, this.waves);
  }
  
  step(delta) {
    this.moveWaves(delta);
    this.moveIcebergs(delta);
    this.surfer.moveSurfer(delta, this.surfer.vel, this.surfer.pos);
    this.checkCrash();
    this.removeWave();
    this.removeIceberg();
    this.powerUp();
    this.endGame();
    this.winGame();
    console.log("All Icebergs", this.icebergs)
  }
  
  checkCrash() {
    const allObjects = this.allObjects();

    for (let i = 0; i < allObjects.length; i++) {
      for (let j = 0; j < allObjects.length; j++) {
        const obj1 = allObjects[i];
        const obj2 = allObjects[j];
        if (obj1.crashedWith(obj2) && obj1 instanceof Iceberg && obj2 instanceof Surfer) {
          debugger
          alert("Game over.");
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
            obj1.remove();
            obj2.remove();
            this.icebergsHit++;

            if (this.icebergs.length === 0) {
              debugger
              this.gameWon = true;
            }
          }
        }
      }
    }
  }

  powerUp() {
    if ((this.icebergsHit >= (Game.NUM_ICEBERGS * .5)) && (this.icebergsHit < (Game.NUM_ICEBERGS * .75))) {
      this.powerDistance = 600;
    } else if ((this.icebergsHit >= (Game.NUM_ICEBERGS * .75)) && (this.icebergsHit < (Game.NUM_ICEBERGS * .8))) {
      this.powerDistance = 650;
    } else if (this.icebergsHit >= (Game.NUM_ICEBERGS * .8)) {
      this.powerDistance = 700;
    }
  }

  endGame() {
    if (this.gameOver) {
      this.objects = [];
      this.surfer = {};
      this.icebergsHit = 0;
      this.gameCanvas.classList.add("hidden");
      this.endScreen.classList.remove("hidden");
    }
  }

  winGame() {
    if (this.gameWon) {
      debugger
      this.objects = [];
      this.surfer = {};
      this.icebergsHit = 0;
      this.gameCanvas.classList.add("hidden");
      this.winScreen.classList.remove("hidden");
    }
  }
}

Game.DIM_X = 1200;
Game.DIM_Y = 550;
Game.NUM_ICEBERGS = 2;
// Game.NUM_ICEBERGS = Math.ceil((100 * Math.random()) * (100 * Math.random()));

console.log(Game)

module.exports = Game;