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

/***/ }),

/***/ "./lib/game_view.js":
/*!**************************!*\
  !*** ./lib/game_view.js ***!
  \**************************/
/***/ ((module) => {

const GameView = function (game, ctx) {
  this.ctx = ctx;
  this.game = game;
  this.surfer = this.game.addSurfer();
};

GameView.MOVES = {
  "up": [0, 1],
  "down": [0, -1],
};

// GameView.prototype.bindKeyHandlers = function () {
//   const surfer = this.surfer;

//   Object.keys(GameView.MOVES).forEach(k => {
//     let move = GameView.MOVES[k];
//     key(k, function () { surfer.})
//   })

//   // key("space", function () { surfer.waterBend() }); //use to push sharks out of the way
// };

GameView.prototype.start = function () {
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

/***/ "./lib/shark.js":
/*!**********************!*\
  !*** ./lib/shark.js ***!
  \**********************/
/***/ ((module) => {

const DEFAULTS = {
  SPEED: 1,
};

const Shark = function (options = {}) {
  options.pos = options.pos || options.game.randomPosition();
  options.vel = options.vel || Util.randomVec(DEFAULTS.SPEED);

  MovingObject.call(this, options);
};

module.exports = Shark;

/***/ }),

/***/ "./lib/surfer.js":
/*!***********************!*\
  !*** ./lib/surfer.js ***!
  \***********************/
/***/ ((module) => {

const DEFAULTS = {
  CHARACTER_WIDTH: 90,
  CHARACTER_HEIGHT: 100,
  CHARACTER: ["Aang", "Kuruk", "Korra"]
};

let Surfer = function (options) {
  options.character = DEFAULTS.CHARACTER.random(),
  options.vel = options.vel || [0,0];
}

Surfer.prototype.bounds = function () {
  return {
    left: this.x,
    right: this.x + DEFAULTS.CHARACTER_WIDTH,
    top: this.y,
    bottom: this.y + DEFAULTS.CHARACTER_HEIGHT,
  };
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
};

module.exports = Util;

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
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
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