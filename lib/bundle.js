/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./lib/background.js":
/*!***************************!*\
  !*** ./lib/background.js ***!
  \***************************/
/***/ ((module) => {

let Background = function () {
  this.backgroundImg = document.getElementById("background");
}

Background.prototype.drawBackground = function (ctx) {
  ctx.drawImage(this.backgroundImg, 0, 0, 1200, 550)
}

module.exports = Background;

/***/ }),

/***/ "./lib/game.js":
/*!*********************!*\
  !*** ./lib/game.js ***!
  \*********************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const Util = __webpack_require__(/*! ./util.js */ "./lib/util.js");
const Surfer = __webpack_require__(/*! ./surfer.js */ "./lib/surfer.js");
const Iceberg = __webpack_require__(/*! ./iceberg.js */ "./lib/iceberg.js");
const MovingObject = __webpack_require__(/*! ./moving_object.js */ "./lib/moving_object.js");
const Power = __webpack_require__(/*! ./power.js */ "./lib/power.js");

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
    this.numIcebergs = Math.floor(Math.random() * (100 - 20 + 1) + 20); // Min: 20, Max: 100
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
      if (this.surfer) {
        this.surfer.moveSurfer(delta, this.surfer.vel, this.surfer.pos);
      }
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

/***/ }),

/***/ "./lib/game_view.js":
/*!**************************!*\
  !*** ./lib/game_view.js ***!
  \**************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const KeyMaster = __webpack_require__(/*! ../src/keymaster.js */ "./src/keymaster.js");
const Power = __webpack_require__(/*! ./power.js */ "./lib/power.js");
const Game = __webpack_require__(/*! ./game.js */ "./lib/game.js");
const Surfer = __webpack_require__(/*! ./surfer.js */ "./lib/surfer.js");
const Background = __webpack_require__(/*! ./background.js */ "./lib/background.js");

const GameView = function (game, ctx) {
  this.ctx = ctx;
  this.game = game;
  this.surfer = this.game.addSurfer();
  this.icebergs = this.game.addIcebergs();
};

const gameContainer = document.getElementById("game-container");
const canvas = document.getElementById("game-canvas");

GameView.MOVES = {
  "up": [0, -0.5],
  "down": [0, 0.5],
  "left": [-0.5, 0],
  "right": [0.5, 0],
};

GameView.prototype.bindKeyHandlers = function () {
  const surfer = this.surfer;

  Object.keys(GameView.MOVES).forEach(k => {
    let move = GameView.MOVES[k];
    key(k, function () { surfer.surf(move) }) 
  })

  key("space", function () { 
    surfer.waterBend()
   });
};

GameView.prototype.start = function () {
  this.backGround = new Background(this.ctx)
  this.game.score = 0;
  this.game.gameOver = false;
  this.bindKeyHandlers();
  this.lastTime = 0;
  requestAnimationFrame(this.animate.bind(this));
};

GameView.prototype.animate = function (time) {
  const delta = time - this.lastTime;
  this.backGround.drawBackground(this.ctx); // draw background first
  this.game.gameDraw(this.ctx); // then draw all items on top of background
  this.lastTime = time;
  this.displayIcebergInfo();
  this.displayPowerInfo();
  if (this.game.waves.length >= this.game.bendingPower) {
    this.powerWarning();
  }
  if (this.game.icebergs.length <= Math.ceil(this.game.numIcebergs * 0.12)) {
    this.gameAlmostWon();
  }
  this.game.step(delta);
  requestAnimationFrame(this.animate.bind(this));
};

GameView.prototype.displayIcebergInfo = function () {
  this.ctx.fillStyle ="#045080"
  this.ctx.font = "15px BlinkMacSystemFont,Roboto,Helvetica Neue,Arial,sans-serif"
  this.ctx.fillText("Number of Icebergs: " + this.game.numIcebergs, 10, 20)
  this.ctx.fillText("Icebergs Hit: " + this.game.icebergsHit, 10, 40)
}

GameView.prototype.displayPowerInfo = function () {
  this.ctx.fillStyle ="#FFFFFF"
  this.ctx.font = "15px BlinkMacSystemFont,Roboto,Helvetica Neue,Arial,sans-serif"
  this.ctx.fillText("Bending Power Distance: " + this.game.powerDistance, 10, 520)
  this.ctx.fillText("Max Bending Power: " + this.game.bendingPower, 10, 540)
}

GameView.prototype.powerWarning = function () {
  this.ctx.fillStyle ="#FE3105"
  this.ctx.font = "25px BlinkMacSystemFont,Roboto,Helvetica Neue,Arial,sans-serif"
  this.ctx.fillText("Your chi is low, you can't bend right now!!!", 360, 240)
}

GameView.prototype.gameAlmostWon = function () {
  this.ctx.fillStyle ="#FFFFFF"
  this.ctx.font = "25px BlinkMacSystemFont,Roboto,Helvetica Neue,Arial,sans-serif"
  this.ctx.fillText("You're almost at the end!!!", 920, 540)
}

GameView.prototype.restart = function () {
  gameContainer.classList.remove("hidden")
  canvas.classList.remove("hidden")
  this.start();
}

module.exports = GameView;

/***/ }),

/***/ "./lib/iceberg.js":
/*!************************!*\
  !*** ./lib/iceberg.js ***!
  \************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const Util = __webpack_require__(/*! ./util.js */ "./lib/util.js");
const MovingObject = __webpack_require__(/*! ./moving_object.js */ "./lib/moving_object.js");

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

/***/ }),

/***/ "./lib/moving_object.js":
/*!******************************!*\
  !*** ./lib/moving_object.js ***!
  \******************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const Util = __webpack_require__(/*! ./util.js */ "./lib/util.js");

const MovingObject = function (options) {
  this.pos = options.pos;
  this.originalPos = [this.pos[0] - 20, this.pos[1]];
  this.vel = options.vel;
  this.radius = options.radius;
  this.color = options.color;
  this.game = options.game;
};

const TIME_DELTA = 1000 / 60;

MovingObject.prototype.draw = function (ctx) {
  ctx.fillStyle = this.color;
  ctx.beginPath();
  ctx.arc(this.pos[0], this.pos[1], this.radius, 0, 2 * Math.PI, false);
  ctx.fill();
}

MovingObject.prototype.moveIceberg = function (delta) {
  const vel = delta / TIME_DELTA;
  const moveX = this.vel[0] * vel * (3 * Math.random());

  if (moveX < this.vel[0]) {
    this.pos = [this.pos[0] + moveX, this.pos[1]];
  }

  if (this.game.isOutOfBounds(this.pos, this.originalPos)) {
    this.vel[0] = this.vel[0];
    this.vel[1] = this.vel[1];
  };
};

MovingObject.prototype.moveWave = function (delta) {
  if (this.game.waves.length > 0) {
    const vel = delta / TIME_DELTA;
    const moveX = this.vel[0] * vel;

    if (moveX > this.vel[0]) {
      setTimeout(() => {
        this.pos = [this.pos[0] + moveX, this.pos[1]];
      }, 1000)
    }

    if (this.pos[0] - this.originalPos[0] === this.game.powerDistance) {
      this.game.removeWave();
    }
  }
}

MovingObject.prototype.moveSurfer = function (delta) {
  const vel = delta / TIME_DELTA;
  const moveX = this.vel[0] * vel;
  const moveY = this.vel[1] * vel;
  
  this.pos = [this.pos[0] + moveX, this.pos[1] + moveY];

  if (this.game.isOutOfBounds(this.pos)) {
    this.vel[0] = 0;
    this.vel[1] = 0;
  };
};

MovingObject.prototype.remove = function () {
  this.game.remove(this);
}

MovingObject.prototype.crashedWith = function (other) {
  const centerDist = Util.dist(this.pos, other.pos);
  return centerDist < (this.radius + other.radius);
};

module.exports = MovingObject;

/***/ }),

/***/ "./lib/power.js":
/*!**********************!*\
  !*** ./lib/power.js ***!
  \**********************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const MovingObject = __webpack_require__(/*! ./moving_object.js */ "./lib/moving_object.js");
const Util = __webpack_require__(/*! ./util.js */ "./lib/util.js");

const DEFAULTS = {
  COLOR: '#0a5aa1',
  RADIUS: 50,
  WAVE_WIDTH: 100,
  WAVE_HEIGHT: 100,
  SPEED: 1,
};

const waveImg = new Image ();
waveImg.src = 'lib/hqdefault.png';

class Power extends MovingObject {
  constructor(options = {}) {
    super(options)
    options.originalPos = options.originalPos || options.game.randomWavePosition();
    options.pos = options.pos || options.game.randomWavePosition();
    options.vel = options.vel || Util.randomVec(DEFAULTS.SPEED);
    options.radius = DEFAULTS.RADIUS;
    options.color = DEFAULTS.COLOR;
    options.image = waveImg.src;
    options.waveImg = document.getElementById('power');
    MovingObject.call(this, options);
  }

  drawWave(ctx) {
    ctx.drawImage(waveImg, this.pos[0], this.pos[1], 100, 100);
  }
}

module.exports = Power;

/***/ }),

/***/ "./lib/surfer.js":
/*!***********************!*\
  !*** ./lib/surfer.js ***!
  \***********************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const MovingObject = __webpack_require__(/*! ./moving_object.js */ "./lib/moving_object.js");
const Power = __webpack_require__(/*! ./power.js */ "./lib/power.js");
const Util = __webpack_require__(/*! ./util.js */ "./lib/util.js");

const DEFAULTS = {
  CHARACTER_WIDTH: 90,
  CHARACTER_HEIGHT: 100,
  COLOR: '#50b9d9',
  RADIUS: 15, // size is affecting collision check
  SPEED: 1,
};

const surferImg = new Image ();
surferImg.src = 'lib/main-qimg-9051717fa22925b5af3ee924dc6c5491.png';

const Surfer = function (options) {
  options.color = DEFAULTS.COLOR;
  options.radius = DEFAULTS.RADIUS;
  options.pos = options.pos || [150,250]
  options.vel = options.vel || [0,0];
  options.x = 200;
  options.y = 200;
  options.spriteX = 0;
  options.spriteY = 35;
  options.spriteWidth = 90;
  options.spriteHeight = 70;
  options.image = surferImg.src
  options.surferImg = document.getElementById('avatar');
  MovingObject.call(this, options)
}

Util.inherits(Surfer, MovingObject);

Surfer.prototype.bounds = function () {
  return {
    left: this.x,
    right: this.x + DEFAULTS.CHARACTER_WIDTH,
    top: this.y,
    bottom: this.y - DEFAULTS.CHARACTER_HEIGHT,
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

Surfer.prototype.drawSurfer = function (ctx) {
  ctx.drawImage(surferImg, this.pos[0], this.pos[1], 100, 100)
}

Surfer.prototype.waterBend = function () {
  let waveVel = [1, 0];
  
  if (this.game.waves.length < this.game.bendingPower) {
    const startPos = this.pos;
    let wave = new Power({
      originalPos: startPos,
      pos: [this.pos[0] + 100, this.pos[1]],
      vel: waveVel,
      color: this.color,
      game: this.game,
    });
    
    setTimeout(() => {
      this.game.waves.push(wave)
    }, 1000)
  }
};

Surfer.prototype.surf = function (impulse) {
  this.vel[0] += impulse[0];
  this.vel[1] += impulse[1];
};

module.exports = Surfer;

/***/ }),

/***/ "./lib/util.js":
/*!*********************!*\
  !*** ./lib/util.js ***!
  \*********************/
/***/ ((module) => {

const Util = {
  dir (vec) {
    var norm = Util.norm(vec);
    return Util.scale(vec, 1 / norm);
  },

  dist (pos1, pos2) {
    return Math.sqrt(
      Math.pow(pos1[0] - pos2[0], 2) + Math.pow(pos1[1] - pos2[1], 2)
    );
  },

  norm (vec) {
    return Util.dist([0,0], vec);
  },

  randomVec (length) {
    var deg = 2 * Math.PI * Math.random();
    return Util.scale([-1 * Math.abs(Math.sin(deg)), Math.abs(Math.cos(deg))], length);
  },

  scale (vec, m) {
    return [vec[0] * m, vec[1] * m];
  },

  inherits(ChildClass, BaseClass) {
    function Surrogate () { this.constructor = ChildClass; }
    Surrogate.prototype = BaseClass.prototype;
    ChildClass.prototype = new Surrogate();
  },
};

module.exports = Util;

/***/ }),

/***/ "./src/keymaster.js":
/*!**************************!*\
  !*** ./src/keymaster.js ***!
  \**************************/
/***/ (function(module) {

  
//     keymaster.js
//     (c) 2011-2013 Thomas Fuchs
//     keymaster.js may be freely distributed under the MIT license.

;(function(global){
  var k,
    _handlers = {},
    _mods = { 16: false, 18: false, 17: false, 91: false },
    _scope = 'all',
    // modifier keys
    _MODIFIERS = {
      '⇧': 16, shift: 16,
      '⌥': 18, alt: 18, option: 18,
      '⌃': 17, ctrl: 17, control: 17,
      '⌘': 91, command: 91
    },
    // special keys
    _MAP = {
      backspace: 8, tab: 9, clear: 12,
      enter: 13, 'return': 13,
      esc: 27, escape: 27, space: 32,
      left: 37, up: 38,
      right: 39, down: 40,
      del: 46, 'delete': 46,
      home: 36, end: 35,
      pageup: 33, pagedown: 34,
      ',': 188, '.': 190, '/': 191,
      '`': 192, '-': 189, '=': 187,
      ';': 186, '\'': 222,
      '[': 219, ']': 221, '\\': 220
    },
    code = function(x){
      return _MAP[x] || x.toUpperCase().charCodeAt(0);
    },
    _downKeys = [];

  for(k=1;k<20;k++) _MAP['f'+k] = 111+k;

  // IE doesn't support Array#indexOf, so have a simple replacement
  function index(array, item){
    var i = array.length;
    while(i--) if(array[i]===item) return i;
    return -1;
  }

  // for comparing mods before unassignment
  function compareArray(a1, a2) {
    if (a1.length != a2.length) return false;
    for (var i = 0; i < a1.length; i++) {
        if (a1[i] !== a2[i]) return false;
    }
    return true;
  }

  var modifierMap = {
      16:'shiftKey',
      18:'altKey',
      17:'ctrlKey',
      91:'metaKey'
  };
  function updateModifierKey(event) {
      for(k in _mods) _mods[k] = event[modifierMap[k]];
  };

  // handle keydown event
  function dispatch(event) {
    var key, handler, k, i, modifiersMatch, scope;
    key = event.keyCode;

    if (index(_downKeys, key) == -1) {
        _downKeys.push(key);
    }

    // if a modifier key, set the key.<modifierkeyname> property to true and return
    if(key == 93 || key == 224) key = 91; // right command on webkit, command on Gecko
    if(key in _mods) {
      _mods[key] = true;
      // 'assignKey' from inside this closure is exported to window.key
      for(k in _MODIFIERS) if(_MODIFIERS[k] == key) assignKey[k] = true;
      return;
    }
    updateModifierKey(event);

    // see if we need to ignore the keypress (filter() can can be overridden)
    // by default ignore key presses if a select, textarea, or input is focused
    if(!assignKey.filter.call(this, event)) return;

    // abort if no potentially matching shortcuts found
    if (!(key in _handlers)) return;

    scope = getScope();

    // for each potential shortcut
    for (i = 0; i < _handlers[key].length; i++) {
      handler = _handlers[key][i];

      // see if it's in the current scope
      if(handler.scope == scope || handler.scope == 'all'){
        // check if modifiers match if any
        modifiersMatch = handler.mods.length > 0;
        for(k in _mods)
          if((!_mods[k] && index(handler.mods, +k) > -1) ||
            (_mods[k] && index(handler.mods, +k) == -1)) modifiersMatch = false;
        // call the handler and stop the event if neccessary
        if((handler.mods.length == 0 && !_mods[16] && !_mods[18] && !_mods[17] && !_mods[91]) || modifiersMatch){
          if(handler.method(event, handler)===false){
            if(event.preventDefault) event.preventDefault();
              else event.returnValue = false;
            if(event.stopPropagation) event.stopPropagation();
            if(event.cancelBubble) event.cancelBubble = true;
          }
        }
      }
    }
  };

  // unset modifier keys on keyup
  function clearModifier(event){
    var key = event.keyCode, k,
        i = index(_downKeys, key);

    // remove key from _downKeys
    if (i >= 0) {
        _downKeys.splice(i, 1);
    }

    if(key == 93 || key == 224) key = 91;
    if(key in _mods) {
      _mods[key] = false;
      for(k in _MODIFIERS) if(_MODIFIERS[k] == key) assignKey[k] = false;
    }
  };

  function resetModifiers() {
    for(k in _mods) _mods[k] = false;
    for(k in _MODIFIERS) assignKey[k] = false;
  };

  // parse and assign shortcut
  function assignKey(key, scope, method){
    var keys, mods;
    keys = getKeys(key);
    if (method === undefined) {
      method = scope;
      scope = 'all';
    }

    // for each shortcut
    for (var i = 0; i < keys.length; i++) {
      // set modifier keys if any
      mods = [];
      key = keys[i].split('+');
      if (key.length > 1){
        mods = getMods(key);
        key = [key[key.length-1]];
      }
      // convert to keycode and...
      key = key[0]
      key = code(key);
      // ...store handler
      if (!(key in _handlers)) _handlers[key] = [];
      _handlers[key].push({ shortcut: keys[i], scope: scope, method: method, key: keys[i], mods: mods });
    }
  };

  // unbind all handlers for given key in current scope
  function unbindKey(key, scope) {
    var multipleKeys, keys,
      mods = [],
      i, j, obj;

    multipleKeys = getKeys(key);

    for (j = 0; j < multipleKeys.length; j++) {
      keys = multipleKeys[j].split('+');

      if (keys.length > 1) {
        mods = getMods(keys);
      }

      key = keys[keys.length - 1];
      key = code(key);

      if (scope === undefined) {
        scope = getScope();
      }
      if (!_handlers[key]) {
        return;
      }
      for (i = 0; i < _handlers[key].length; i++) {
        obj = _handlers[key][i];
        // only clear handlers if correct scope and mods match
        if (obj.scope === scope && compareArray(obj.mods, mods)) {
          _handlers[key][i] = {};
        }
      }
    }
  };

  // Returns true if the key with code 'keyCode' is currently down
  // Converts strings into key codes.
  function isPressed(keyCode) {
      if (typeof(keyCode)=='string') {
        keyCode = code(keyCode);
      }
      return index(_downKeys, keyCode) != -1;
  }

  function getPressedKeyCodes() {
      return _downKeys.slice(0);
  }

  function filter(event){
    var tagName = (event.target || event.srcElement).tagName;
    // ignore keypressed in any elements that support keyboard data input
    return !(tagName == 'INPUT' || tagName == 'SELECT' || tagName == 'TEXTAREA');
  }

  // initialize key.<modifier> to false
  for(k in _MODIFIERS) assignKey[k] = false;

  // set current scope (default 'all')
  function setScope(scope){ _scope = scope || 'all' };
  function getScope(){ return _scope || 'all' };

  // delete all handlers for a given scope
  function deleteScope(scope){
    var key, handlers, i;

    for (key in _handlers) {
      handlers = _handlers[key];
      for (i = 0; i < handlers.length; ) {
        if (handlers[i].scope === scope) handlers.splice(i, 1);
        else i++;
      }
    }
  };

  // abstract key logic for assign and unassign
  function getKeys(key) {
    var keys;
    key = key.replace(/\s/g, '');
    keys = key.split(',');
    if ((keys[keys.length - 1]) == '') {
      keys[keys.length - 2] += ',';
    }
    return keys;
  }

  // abstract mods logic for assign and unassign
  function getMods(key) {
    var mods = key.slice(0, key.length - 1);
    for (var mi = 0; mi < mods.length; mi++)
    mods[mi] = _MODIFIERS[mods[mi]];
    return mods;
  }

  // cross-browser events
  function addEvent(object, event, method) {
    if (object.addEventListener)
      object.addEventListener(event, method, false);
    else if(object.attachEvent)
      object.attachEvent('on'+event, function(){ method(window.event) });
  };

  // set the handlers globally on document
  addEvent(document, 'keydown', function(event) { dispatch(event) }); // Passing _scope to a callback to ensure it remains the same by execution. Fixes #48
  addEvent(document, 'keyup', clearModifier);

  // reset modifiers to false whenever the window is (re)focused.
  addEvent(window, 'focus', resetModifiers);

  // store previously defined key
  var previousKey = global.key;

  // restore previously defined key and return reference to our key object
  function noConflict() {
    var k = global.key;
    global.key = previousKey;
    return k;
  }

  // set window.key and window.key.set/get/deleteScope, and the default filter
  global.key = assignKey;
  global.key.setScope = setScope;
  global.key.getScope = getScope;
  global.key.deleteScope = deleteScope;
  global.key.filter = filter;
  global.key.isPressed = isPressed;
  global.key.getPressedKeyCodes = getPressedKeyCodes;
  global.key.noConflict = noConflict;
  global.key.unbind = unbindKey;

  if(true) module.exports = assignKey;

})(this);

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
/*!********************************!*\
  !*** ./lib/infinite_runner.js ***!
  \********************************/
document.addEventListener('DOMContentLoaded', () => {
  const GameView = __webpack_require__(/*! ./game_view.js */ "./lib/game_view.js");
  const Game = __webpack_require__(/*! ./game.js */ "./lib/game.js");
  
  const canvas = document.getElementById("game-canvas");
  const ctx = canvas ? canvas.getContext("2d") : {};
  
  if (canvas) {
    canvas.setAttribute("width", "1200px");
    canvas.setAttribute("height", "550px");
  }
  
  const continueButton = document.getElementById('continue');
  const startButton = document.getElementById('start');
  const loseRestartButton = document.getElementById('lose-restart');
  const winRestartButton = document.getElementById('win-restart');
  const splash = document.getElementById('splash');
  const instructions = document.getElementById('game-explanation');
  const endScreen = document.getElementById("end-screen");
  const winScreen = document.getElementById("win-screen");
  const g = new Game(ctx);
  const game = new GameView(g, ctx)
  const gameContainer = document.getElementById("game-container");
  
  
  if (startButton) {
    startButton.addEventListener("click", () => {
      splash.classList.add("hidden");
      instructions.classList.remove("hidden");
    })
  }
  
  if (continueButton) {
    continueButton.addEventListener("click", () => {
      instructions.classList.add("hidden");
      gameContainer.classList.remove("hidden");
      canvas.classList.remove("hidden");
      game.start();
    });
  }
  
  if (loseRestartButton) {
    loseRestartButton.addEventListener("click", () => {
      window.location.reload()
      endScreen.classList.add("hidden");
      gameContainer.classList.remove("hidden");
      game.restart();
    });
  }
  
  if (winRestartButton) {
    winRestartButton.addEventListener("click", () => {
      window.location.reload()
      winScreen.classList.add("hidden");
      gameContainer.classList.remove("hidden");
      game.restart();
    });
  }
})
})();

/******/ })()
;
//# sourceMappingURL=bundle.js.map