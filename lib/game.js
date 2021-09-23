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
    this.powerDistance = 150;
    this.bendingPower = 3;
    this.objects = this.allObjects();
    this.gameCanvas = document.getElementById("game-canvas") ? document.getElementById("game-canvas") : {};
    this.endScreen = document.getElementById("end-screen") ? document.getElementById("end-screen") : {};
    this.winScreen = document.getElementById("win-screen") ? document.getElementById("win-screen") : {};
    this.numIcebergs = Math.floor(Math.random() * (250 - 20 + 1) + 20); // Min: 20, Max: 250
    this.icebergsHit = 0;
    this.ctx = ctx;
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
    if (this.icebergs.length > 0) {
      this.icebergs.forEach((iceberg, i) => {
        setTimeout(() => {
            iceberg.moveIceberg(delta);
          }, 1500 * i)
        });
    }
  }
  
  moveWaves(delta) {
    this.waves.forEach(wave => {
      setTimeout(() => {
        wave.moveWave(delta);
      }, 500)
    });
  }
  
  isOutOfBounds(pos, originalPos = 0) {
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
      if (this.isOutOfBounds(iceberg.pos, 0) || this.gameOver) {
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
        if ((object.pos[0] - object.originalPos[0]) > this.powerDistance) {
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
    for (let i = 0; i < this.numIcebergs; i++) {
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
    if (!this.gameWon && !this.gameOver) {
      this.moveWaves(delta);
      this.moveIcebergs(delta);
      this.surfer.moveSurfer(delta, this.surfer.vel, this.surfer.pos);
      this.checkCrash();
      this.powerUp();
      this.removeWave();
      this.removeIceberg();
    }
    this.endGame();
    this.winGame();
  }
  
  checkCrash() {
    const allObjects = this.allObjects();

    for (let i = 0; i < allObjects.length; i++) {
      for (let j = 0; j < allObjects.length; j++) {
        const obj1 = allObjects[i];
        const obj2 = allObjects[j];
        if (obj1.crashedWith(obj2) && obj1 instanceof Iceberg && obj2 instanceof Surfer) {
          alert("Game over.");
          this.gameOver = true;
        }
      }
    }

    for (let i = 0; i < allObjects.length; i++) {
      for (let j = 0; j < allObjects.length; j++) {
        const obj1 = allObjects[i];
        const obj2 = allObjects[j];
        if (obj1.crashedWith(obj2) && obj1 instanceof Power && obj2 instanceof Surfer) {
          this.remove(obj1)
        }
      }
    }

    for (let i = 0; i < allObjects.length; i++) {
      for (let j = 0; j < allObjects.length; j++) {
        let obj1 = allObjects[i];
        let obj2 = allObjects[j];
        if (obj1 instanceof Power && obj2 instanceof Iceberg) {
          if (obj1.crashedWith(obj2)) {
            this.remove(obj1);
            this.remove(obj2);
            this.icebergsHit++;
            if (this.icebergs.length === 0) {
              this.gameWon = true;
            }
          }
        }
      }
    }
  }

  powerUp() {
    if ((this.icebergsHit >= (this.numIcebergs * .15)) && (this.icebergsHit < (this.numIcebergs * .2))) {
      this.powerDistance = 200;
    } else if ((this.icebergsHit >= (this.numIcebergs * .2)) && (this.icebergsHit < (this.numIcebergs * .35))) {
      this.powerDistance = 300;
    } else if ((this.icebergsHit >= (this.numIcebergs * .35)) && (this.icebergsHit < (this.numIcebergs * .75))) {
      this.powerDistance = 400;
      this.bendingPower = 5;
    } else if ((this.icebergsHit >= (this.numIcebergs * .75)) && (this.icebergsHit < (this.numIcebergs * .8))) {
      this.powerDistance = 600;
      this.bendingPower = 6;
    } else if (this.icebergsHit >= (this.numIcebergs * .8)) {
      this.powerDistance = 700;
      this.bendingPower = 8;
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

module.exports = Game;