/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./lib/game.js":
/*!*********************!*\
  !*** ./lib/game.js ***!
  \*********************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const Util = __webpack_require__(/*! ./util.js */ "./lib/util.js");
const Surfer = __webpack_require__(/*! ./surfer.js */ "./lib/surfer.js");
const Shark = __webpack_require__(/*! ./shark.js */ "./lib/shark.js");
const MovingObject = __webpack_require__(/*! ./moving_object.js */ "./lib/moving_object.js");
const Power = __webpack_require__(/*! ./power.js */ "./lib/power.js");

let Game = function() {
  this.surfer;
  this.sharks = this.addSharks();
  this.whirlpools = [];
  this.waves = [];
  this.paused = false;
  this.frame = 0;
}

Game.DIM_X = 1000;
Game.DIM_Y = 580;
// Game.NUM_SHARKS = 5;
Game.NUM_SHARKS = (25 * Math.random()) * (10 * Math.random());
Game.NUM_WAVES = 10;
Game.NUM_WHIRLPOOLS = 10; 

Game.prototype.pauseGame = function () {
  this.paused = true;
  this.frame = 0;
}

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
    setTimeout(() => {
      object.moveShark(delta)
    }, i * 3000)
  })
}

Game.prototype.moveWaves = function (delta) {
  this.waves.forEach((wave, i) => {
    wave.moveWave(delta)
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
};

Game.prototype.removeShark = function () {
  this.sharks.forEach(shark => {
    if (this.isOutOfBounds(shark.pos)) this.remove(shark)
  })
}

Game.prototype.removeWave = function () {
  const allObjects = this.allObjects();
  allObjects.forEach(object => {
    if (object instanceof Power) {
      if (object.pos[0] > 350) {
        this.remove(object)
      }
    }
  })
}

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
    (sharks.push(
      new Shark({
        game: this,
        pos: this.randomPosition(),
      })
    ))
  };
  this.sharks = sharks;
  return this.sharks;
};

Game.prototype.addWaves = function () {
  let waves = [];
  for (let i = 0; i < Game.NUM_WAVES; i++) {
    (waves.push(
      new Power({
        game: this,
        pos: this.surfer.pos,
      })
    ))
  }
  this.waves = waves;
  return this.waves;
}

Game.prototype.addWhirlpools = function () {
  for (let i = 0; i < Game.NUM_WHIRLPOOLS; i++) {
    this.whirlpools.push(new Whirlpool({ game: this }));
  };
};

Game.prototype.draw = function (ctx) {
  ctx.clearRect(0, 0, Game.DIM_X, Game.DIM_Y);
  ctx.fillStyle = "#000000";
  ctx.fillRect(0, 0, Game.DIM_X, Game.DIM_Y);

  
  this.allObjects().forEach(object => {
    object.draw(ctx)
  })

  this.surfer.draw(ctx)

  ctx.clearRect(Game.DIM_X, 0, Game.DIM_X, Game.DIM_Y);
  ctx.clearRect(0, Game.DIM_Y, Game.DIM_X * 2, Game.DIM_Y);
};

Game.prototype.allObjects = function () {
  return [].concat(this.sharks, this.whirlpools, this.waves);
};

Game.prototype.step = function (delta) {
  this.moveSharks(delta);
  this.moveWaves(delta);
  this.surfer.moveSurfer(delta);
  this.checkCrash();
  this.removeWave();
  this.removeShark();
  console.log("Game stats")
  console.log(this)
};

Game.prototype.checkCrash = function () {
  const allObjects = this.allObjects();

  for (let i = 0; i < allObjects.length; i++) {
    const obj = allObjects[i];
    if (obj.crashedWith(this.surfer) && obj instanceof Shark) {
      obj.remove()
      console.log("You have crashed into a shark")
      alert("Game over.")
      return;
    }
  }

  for (let i = 0; i < allObjects.length; i++) {
    for (let j = 0; j < allObjects.length; j++) {
      let obj1 = allObjects[i];
      let obj2 = allObjects[j];
      if (obj1 instanceof Power && obj2 instanceof Shark) {
        if (obj1.crashedWith(obj2)) {
          console.log("Plus 1 point for hitting a shark!")
          obj2.remove()
        }
      }
    }
  }
};

module.exports = Game;

/***/ }),

/***/ "./lib/game_view.js":
/*!**************************!*\
  !*** ./lib/game_view.js ***!
  \**************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const KeyMaster = __webpack_require__(/*! ../src/keymaster.js */ "./src/keymaster.js");
const Power = __webpack_require__(/*! ./power.js */ "./lib/power.js");

const GameView = function (game, ctx) {
  this.ctx = ctx;
  this.game = game;
  this.surfer = this.game.addSurfer();
};

GameView.MOVES = {
  "up": [0, -1],
  "down": [0, 1],
};

GameView.prototype.bindKeyHandlers = function () {
  const surfer = this.surfer;

  Object.keys(GameView.MOVES).forEach(k => {
    let move = GameView.MOVES[k];
    key(k, function () { surfer.surf(move) }) 
  })

  key("space", function () { surfer.waterBend() });
};

GameView.prototype.start = function () {
  console.log(this.game);
  this.bindKeyHandlers();
  this.lastTime = 0;
  requestAnimationFrame(this.animate.bind(this));
};

GameView.prototype.animate = function (time) {
  const delta = time - this.lastTime;

  this.game.step(delta);
  this.game.draw(this.ctx);
  this.lastTime = time;

  requestAnimationFrame(this.animate.bind(this));
};

module.exports = GameView;

/***/ }),

/***/ "./lib/moving_object.js":
/*!******************************!*\
  !*** ./lib/moving_object.js ***!
  \******************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const Util = __webpack_require__(/*! ./util.js */ "./lib/util.js");

const MovingObject = function (options) {
  this.pos = options.pos;
  this.vel = options.vel;
  this.radius = options.radius;
  this.color = options.color;
  this.game = options.game;
};

MovingObject.prototype.crashWith = function (other) {};
MovingObject.prototype.isWrappable = true;

const TIME_DELTA = 1000 / 60;

MovingObject.prototype.draw = function (ctx) {
  ctx.fillStyle = this.color;
  ctx.beginPath();
  ctx.arc(this.pos[0], this.pos[1], this.radius, 0, 2 * Math.PI, false);
  ctx.fill();
}

MovingObject.prototype.moveShark = function (delta) {
  const vel = delta / TIME_DELTA,
    moveX = this.vel[0] * vel,
    moveY = 0;

  if (moveX < this.vel[0]) {
    this.pos = [this.pos[0] + moveX, this.pos[1]];
  }

  if (this.game.isOutOfBounds(this.pos)) {
    this.vel[0] = this.vel[0];
    this.vel[1] = this.vel[1];
  };
};

MovingObject.prototype.moveWave = function (delta) {
  const vel = delta / TIME_DELTA,
    moveX = this.vel[0] * vel;

  if (moveX > this.vel[0]) {
    this.pos = [this.pos[0] + moveX, this.pos[1]];
  }
}

MovingObject.prototype.moveSurfer = function (delta) {
  const vel = delta / TIME_DELTA,
    moveX = this.vel[0] * vel,
    moveY = this.vel[1] * vel;

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
  RADIUS: 15,
  WAVE_WIDTH: 50,
  WAVE_HEIGHT: 40,
  SPEED: 1,
};

const Power = function (options = {}) {
  options.pos = options.pos || options.game.randomWavePosition();
  options.vel = options.vel || Util.randomVec(DEFAULTS.SPEED);
  options.radius = DEFAULTS.RADIUS;
  options.color = DEFAULTS.COLOR;
  MovingObject.call(this, options);
}

Util.inherits(Power, MovingObject);

module.exports = Power;

/***/ }),

/***/ "./lib/shark.js":
/*!**********************!*\
  !*** ./lib/shark.js ***!
  \**********************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const Util = __webpack_require__(/*! ./util.js */ "./lib/util.js");
const MovingObject = __webpack_require__(/*! ./moving_object.js */ "./lib/moving_object.js");

const DEFAULTS = {
  COLOR: "#888c89",
  SHARK_WIDTH: 80,
  SHARK_HEIGHT: 90,
  RADIUS: 15,
  SPEED: 1,
};

const Shark = function (options = {}) {
  options.pos = options.pos || options.game.randomPosition();
  options.vel = options.vel || Util.randomVec(DEFAULTS.SPEED);
  options.color = DEFAULTS.COLOR;
  options.radius = DEFAULTS.RADIUS;
  MovingObject.call(this, options);
};

Shark.prototype.bounds = function () {
  return {
    left: this.x,
    right: this.x + DEFAULTS.CHARACTER_WIDTH,
    top: this.y,
    bottom: this.y + DEFAULTS.CHARACTER_HEIGHT,
  };
};

Util.inherits(Shark, MovingObject);

module.exports = Shark;

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
  let norm = Util.norm(this.vel);

  let relVel = Util.scale(Util.dir(this.vel), 2);
  
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
const GameView = __webpack_require__(/*! ./game_view.js */ "./lib/game_view.js");
const Game = __webpack_require__(/*! ./game.js */ "./lib/game.js");

document.addEventListener("DOMContentLoaded", function() {
  const canvasEl = document.getElementsByTagName("canvas")[0];
  canvasEl.height = window.innerHeight - 100;
  canvasEl.width = window.innerWidth - 100;

  const ctx = canvasEl.getContext("2d");
  const g = new Game();
  new GameView(g, ctx).start();
});
})();

/******/ })()
;
//# sourceMappingURL=bundle.js.map