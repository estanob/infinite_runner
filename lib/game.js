const Util = require('./util.js');
const Surfer = require('./surfer.js');
const Iceberg = require('./iceberg.js');
const MovingObject = require('./moving_object.js');
const Power = require('./power.js');

// should game be function or class???
class Game {
  constructor(ctx) {
    this.surfer = {};
    this.icebergs = [];
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
      }, 1500);
    });
  }
  isOutOfBounds(pos) {
    return (
      (pos[0] < 0) ||
      (pos[1] < 0) ||
      (pos[0] > Game.DIM_X) ||
      (pos[1] > Game.DIM_Y)
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
      if (this.isOutOfBounds(iceberg.pos) || this.gameOver)
        this.remove(iceberg);
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
    console.log("Surfer is being called");
    const surfer = new Surfer({
      pos: this.surferStartPosition(),
      game: this,
    });
    this.surfer = surfer;
    console.log(this.surfer);
    return this.surfer;
  }
  addIcebergs() {
    let icebergs = [];
    for (let i = 0; i < Game.NUM_ICEBERGS; i++) {
      setTimeout(() => {
        icebergs.push(
          new Iceberg({
            game: this,
            pos: this.randomPosition(),
          })
        );
      }, i * 1500);
    };
    this.icebergs = icebergs
    console.log("Icebergs", this.icebergs)
    return this.icebergs;
  }
  addWhirlpools() {
    for (let i = 0; i < Game.NUM_WHIRLPOOLS; i++) {
      this.whirlpools.push(new Whirlpool({ game: this }));
    };
  }
  gameDraw(ctx) {
    // ctx.clearRect(0, 0, Game.DIM_X, Game.DIM_Y);
    // ctx.fillRect(0, 0, Game.DIM_X, Game.DIM_Y);
    this.allObjects().forEach(object => {
      if (object instanceof Power) {
        object.drawWave(ctx)
      } else if (object instanceof Surfer) {
        object.drawSurfer(ctx)
      } else if (object instanceof Iceberg) {
        // debugger
        object.drawIceberg(ctx)
      } else {
        object.draw(ctx);
      }
    });
  }
  allObjects() {
    return [].concat(this.surfer, this.icebergs, this.whirlpools, this.waves);
  }
  step(delta) {
    this.moveWaves(delta);
    this.moveIcebergs(delta);
    this.surfer.moveSurfer(delta, this.surfer.vel, this.surfer.pos);
    this.checkCrash();
    this.removeWave();
    this.powerUp();
    this.endGame();
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
        let obj1 = allObjects[i];
        let obj2 = allObjects[j];
        if (obj1 instanceof Power && obj2 instanceof Iceberg) {
          if (obj1.crashedWith(obj2)) {
            obj1.remove();
            obj2.remove();
            this.icebergsHit++;
          }
        }
      }
    }
  }
  powerUp() {
    if ((this.icebergsHit >= (Game.NUM_ICEBERGS * .5)) && (this.icebergsHit < (Game.NUM_ICEBERGS * .75))) {
      this.powerDistance = 600;
      alert("Your waves can reach further now!");
    } else if ((this.icebergsHit >= (Game.NUM_ICEBERGS * .75)) && (this.icebergsHit < (Game.NUM_ICEBERGS * .8))) {
      this.powerDistance = 650;
      alert("Your waves can reach further now!");
    } else if (this.icebergsHit >= (Game.NUM_ICEBERGS * .8)) {
      this.powerDistance = 700;
      alert("Your waves can reach further now!");
    }
  }
  endGame() {
    if (this.gameOver) {
      this.objects = [];
      this.icebergsHit = 0;
      this.gameCanvas.classList.add("hidden");
      this.endScreen.classList.remove("hidden");
    }
  }
}

Game.DIM_X = 1200;
Game.DIM_Y = 550;
Game.NUM_ICEBERGS = 100;
Game.NUM_WHIRLPOOLS = 10; 





















module.exports = Game;