const DEFAULTS = {
  CHARACTER: ["Aang", "Kuruk", "Korra"]
};

let Surfer = function (options) {
  options.character = DEFAULTS.CHARACTER.random(),
  options.vel = options.vel || [0,0];
}

module.exports = Surfer;