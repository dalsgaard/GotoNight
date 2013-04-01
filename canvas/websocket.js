
document.addEventListener('DOMContentLoaded', setup, false);

function setup() {

  var canvas = document.querySelector('canvas');
  var ctx = canvas.getContext("2d");
  var width = canvas.width;
  var height = canvas.height;

  var images = [];
  for (var i = 1; i < 9; i++) {
    var fishLR = new Image();
    fishLR.src = '../images/fish' + i + '.png';
    var fishRL = new Image();
    fishRL.src = '../images/fish' + i + 'r.png';
    images.push([fishLR, fishRL]);
  }

  var maxX = width - 90;
  var maxY = height - 60;

  var views = [];

  for (var i = 0; i < 8; i++) {
    view = new FishView(images[i], 0, 0, false);
    views.push(view);
  }

  var points = null;

  function draw() {
    ctx.clearRect(0, 0, width, height);
    if (points) {
      var array = points;
      for (var i = 0, s = views.length; i < s; i++) {
        var view = views[i];
        view.update(array[i * 2], array[i * 2 + 1]);
        view.draw(ctx);
      }
    }
    window.requestAnimationFrame(function() {
      draw();
    });
  }
  draw();

  var ws = new WebSocket("ws://truffaut.local:8320");
  ws.binaryType = "arraybuffer";

  ws.onopen = function() {
  };

  ws.onmessage = function(message) {
    points = new Float32Array(message.data);
  };

  ws.onerror = function(error) {
    console.log(error);
  };

}

function FishView(images, x, y, reverse) {
  this.imageLR = images[0];
  this.imageRL = images[1];
  this.x = x;
  this.y = y;
  this.reverse = reverse;
}

FishView.prototype.update = function(x, y) {
  if (this.x != x) {
    this.reverse = this.x > x;
  }
  this.x = x;
  this.y = y;
};

FishView.prototype.draw = function(ctx) {
  var image = this.reverse ? this.imageRL : this.imageLR;
  ctx.drawImage(image, this.x, this.y);
};
