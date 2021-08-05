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