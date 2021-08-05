/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./lib/game.js":
/*!*********************!*\
  !*** ./lib/game.js ***!
  \*********************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

eval("const Util = __webpack_require__(/*! ./util.js */ \"./lib/util.js\");\nconst Surfer = __webpack_require__(/*! ./surfer.js */ \"./lib/surfer.js\");\nconst Shark = __webpack_require__(/*! ./shark.js */ \"./lib/shark.js\");\nconst MovingObject = __webpack_require__(/*! ./moving_object.js */ \"./lib/moving_object.js\");\n\nconst Game = function() {\n  this.sharks = [];\n  this.whirlpools = [];\n\n  this.addSharks();\n}\n\nGame.DIM_X = window.innerWidth;\nGame.DIM_Y = window.innerHeight;\nGame.NUM_SHARKS = 10;\nGame.NUM_WHIRLPOOLS = 10; \n\nGame.prototype.randomPosition = function () {\n  const RAND_X = Game.DIM_X * Math.random();\n  const RAND_Y = Game.DIM_Y * Math.random();\n  return [RAND_X, RAND_Y];\n};\n\nGame.prototype.moveSharks = function (delta) {\n  this.allObjects().forEach(object => {\n    object.move(delta);\n  })\n}\n\nGame.prototype.isOutOfBounds = function (pos) {\n  return (pos[0] < 0) ||\n         (pos[1] < 0) ||\n         (pos[0] < Game.DIM_X) ||\n         (pos[1] < Game.DIM_Y);\n};\n\nGame.prototype.remove = function (object) {\n  if (object instanceof Shark) {\n    this.sharks.splice(this.sharks.indexOf(object), 1);\n  };\n};\n\nGame.prototype.addSurfer = function () {\n  const surfer = new Surfer({\n    pos: [0, 0],\n    game: this,\n  });\n\n  return surfer;\n};\n\nGame.prototype.addSharks = function () {\n  for (let i = 0; i < Game.NUM_SHARKS; i++) {\n    this.sharks.push(new Shark({ game: this }));\n  };\n};\n\nGame.prototype.addWhirlpools = function () {\n  for (let i = 0; i < Game.NUM_WHIRLPOOLS; i++) {\n    this.sharks.push(new Whirlpool({ game: this }));\n  };\n};\n\nGame.prototype.draw = function (ctx) {\n  ctx.clearRect(0, 0, Game.DIM_X, Game.DIM_Y);\n  ctx.fillStyle = \"#000000\";\n  ctx.fillRect(0, 0, Game.DIM_X, Game.DIM_Y);\n\n  this.allObjects().forEach(object => {\n    object.draw(ctx)\n  })\n\n  ctx.clearRect(Game.DIM_X, 0, Game.DIM_X, Game.DIM_Y);\n  ctx.clearRect(0, Game.DIM_Y, Game.DIM_X * 2, Game.DIM_Y);\n};\n\nGame.prototype.allObjects = function () {\n  return [].concat(this.sharks, this.whirlpools);\n};\n\nGame.prototype.step = function (delta) {\n  this.moveSharks(delta);\n  this.checkCrash();\n};\n\nGame.prototype.checkCrash = function () {\n  const allObjects = this.allObjects();\n\n  for (let i = 0; i < allObjects.length; i++) {\n    for (let j = 0; j < allObjects.length; j++) {\n      const obj1 = allObjects[i];\n      const obj2 = allObjects[j];\n\n      if (obj1.crashedWith(obj2)) {\n        const crash = obj1.crashWith(obj2);\n        if (crash) {\n          return;\n        };\n      };\n    };\n  };\n};\n\nmodule.exports = Game;\n\n//# sourceURL=webpack://js_game/./lib/game.js?");

/***/ }),

/***/ "./lib/moving_object.js":
/*!******************************!*\
  !*** ./lib/moving_object.js ***!
  \******************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

eval("const Util = __webpack_require__(/*! ./util.js */ \"./lib/util.js\");\n\nconst MovingObject = function (options) {\n  this.pos = options.pos;\n  this.vel = options.vel;\n  this.game = options.game;\n};\n\nMovingObject.prototype.collideWith = function (other) {};\nMovingObject.prototype.isWrappable = true;\n\nconst TIME_DELTA = 1000 / 60;\n\nMovingObject.prototype.move = function (delta) {\n  const vel = delta / TIME_DELTA,\n    moveX = this.vel[0] * vel,\n    moveY = this.vel[1] * vel;\n\n  this.pos = [this.pos[0] + moveX, this.pos[1] + moveY];\n\n  if (this.game.isOutOfBounds(this.pos)) {\n    this.remove();\n  };\n};\n\nMovingObject.prototype.remove = function () {\n  this.game.remove(this);\n}\n\nMovingObject.prototype.isCollidedWith = function (other) {\n  const centerDist = Util.dist(this.pos, other.pos);\n  return centerDist < (this.radius + other.radius);\n};\n\nmodule.exports = MovingObject;\n\n//# sourceURL=webpack://js_game/./lib/moving_object.js?");

/***/ }),

/***/ "./lib/shark.js":
/*!**********************!*\
  !*** ./lib/shark.js ***!
  \**********************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

eval("const Util = __webpack_require__(/*! ./util.js */ \"./lib/util.js\");\nconst MovingObject = __webpack_require__(/*! ./moving_object.js */ \"./lib/moving_object.js\");\n\nconst DEFAULTS = {\n  SPEED: 1,\n};\n\nconst Shark = function (options = {}) {\n  options.pos = options.pos || options.game.randomPosition();\n  options.vel = options.vel || Util.randomVec(DEFAULTS.SPEED);\n\n  MovingObject.call(this, options);\n};\n\nUtil.inherits(Shark, MovingObject);\n\nmodule.exports = Shark;\n\n//# sourceURL=webpack://js_game/./lib/shark.js?");

/***/ }),

/***/ "./lib/surfer.js":
/*!***********************!*\
  !*** ./lib/surfer.js ***!
  \***********************/
/***/ ((module) => {

eval("const DEFAULTS = {\n  CHARACTER_WIDTH: 90,\n  CHARACTER_HEIGHT: 100,\n  // CHARACTER: [\"Aang\", \"Kuruk\", \"Korra\"]\n};\n\nlet Surfer = function (options) {\n  // options.character = DEFAULTS.CHARACTER[CHARACTER.length.random()],\n  options.vel = options.vel || [0,0];\n}\n\nSurfer.prototype.bounds = function () {\n  return {\n    left: this.x,\n    right: this.x + DEFAULTS.CHARACTER_WIDTH,\n    top: this.y,\n    bottom: this.y + DEFAULTS.CHARACTER_HEIGHT,\n  };\n};\n\nSurfer.prototype.waterBend = function (impulse) {\n  this.vel[0] += impulse[0];\n  this.vel[1] += impulse[1];\n};\n\nmodule.exports = Surfer;\n\n//# sourceURL=webpack://js_game/./lib/surfer.js?");

/***/ }),

/***/ "./lib/util.js":
/*!*********************!*\
  !*** ./lib/util.js ***!
  \*********************/
/***/ ((module) => {

eval("const Util = {\n  dir (vec) {\n    var norm = Util.norm(vec);\n    return Util.scale(vec, 1 / norm);\n  },\n\n  dist (pos1, pos2) {\n    return Math.sqrt(\n      Math.pow(pos1[0] - pos2[0], 2) + Math.pow(pos1[1] - pos2[1], 2)\n    );\n  },\n\n  randomVec (length) {\n    var deg = 2 * Math.PI * Math.random();\n    return Util.scale([Math.sin(deg), Math.cos(deg)], length);\n  },\n\n  scale (vec, m) {\n    return [vec[0] * m, vec[1] * m];\n  },\n\n  inherits(ChildClass, BaseClass) {\n    function Surrogate () { this.constructor = ChildClass; }\n    Surrogate.prototype = BaseClass.prototype;\n    ChildClass.prototype = new Surrogate();\n  },\n};\n\nmodule.exports = Util;\n\n//# sourceURL=webpack://js_game/./lib/util.js?");

/***/ }),

/***/ "./src/index.js":
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
/***/ ((__unused_webpack_module, __unused_webpack_exports, __webpack_require__) => {

eval("const InfiniteRunner = __webpack_require__(/*! ../lib/game.js */ \"./lib/game.js\");\n\nconst canvas = document.getElementById('game-canvas');\nnew InfiniteRunner(canvas);\n\n//# sourceURL=webpack://js_game/./src/index.js?");

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
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = __webpack_require__("./src/index.js");
/******/ 	
/******/ })()
;