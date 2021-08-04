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