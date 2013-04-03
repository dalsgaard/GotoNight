
document.addEventListener('DOMContentLoaded', setup, false);

function setup() {

  // Selecting the Canvas and getting the Context
  var canvas = document.querySelector('canvas');
  var ctx = canvas.getContext("2d");
  var width = canvas.width;
  var height = canvas.height;

  // Setting up some fish images
  var images = [];
  for (var i = 1; i < 9; i++) {
    var fishLR = new Image();
    fishLR.src = '../images/fish' + i + '.png';
    var fishRL = new Image();
    fishRL.src = '../images/fish' + i + 'r.png';
    images.push([fishLR, fishRL]);
  }

  // Setting up the boundaries
  var maxX = width - 90;
  var maxY = height - 60;

  // Creating Views
  var views = [];
  for (var i = 0; i < 8; i++) {
    view = new FishView(images[i], 0, 0, false);
    views.push(view);
  }

  /*
    Points is the data that tells the views where to place the fish.
    It contains two floats per fish - the x and the y coordinate.
  */
  var points = null;

  // The draw function - called when a new frame should be drawn
  function draw() {
    ctx.clearRect(0, 0, width, height);
    if (points) {
      for (var i = 0, s = views.length; i < s; i++) {
        var view = views[i];
        view.update(points[i * 2], points[i * 2 + 1]);
        view.draw(ctx);
      }
    }
    window.requestAnimationFrame(function() {
      draw();
    });
  }
  draw();

  // Setting up the WebSocket
  var ws = new WebSocket("ws://truffaut.local:8321");
  ws.binaryType = "arraybuffer";

  // When the connection opens
  ws.onopen = function() {
  };

  // Receives new locations for the fish
  ws.onmessage = function(message) {
    points = new Float32Array(message.data);
  };

  // When a connection error occurs
  ws.onerror = function(error) {
    console.log(error);
  };

}

/*
  The Fish View Object

  A fish object has a left- and a right image, and it gets a starting point.
*/
function FishView(images, x, y, reverse) {
  this.imageLR = images[0];
  this.imageRL = images[1];
  this.x = x;
  this.y = y;
  this.reverse = reverse;
}

// Updates its state based on a new x and y position.
FishView.prototype.update = function(x, y) {
  if (this.x != x) {
    this.reverse = this.x > x;
  }
  this.x = x;
  this.y = y;
};

// Draws itself in the context
FishView.prototype.draw = function(ctx) {
  var image = this.reverse ? this.imageRL : this.imageLR;
  ctx.drawImage(image, this.x, this.y);
};
