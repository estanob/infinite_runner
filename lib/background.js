let Background = function () {
  this.backgroundImg = document.getElementById("background");
}

Background.prototype.drawBackground = function (ctx) {
  ctx.drawImage(this.backgroundImg, 0, 0, 1200, 550)
}

module.exports = Background;