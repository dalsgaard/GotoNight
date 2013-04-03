
document.addEventListener('DOMContentLoaded', setup, false);

function setup() {

  // Selecting the Canvas and getting the Context
  var canvas = document.querySelector('canvas');
  var ctx = canvas.getContext("2d");
  var width = canvas.width;
  var height = canvas.height;

  // Setting up some fish images
  var fish2LR = new Image();
  fish2LR.src = '../images/fish2.png';
  var fish2RL = new Image();
  fish2RL.src = '../images/fish2r.png';
  var images = [];
  images.push([fish2LR, fish2RL]);

  // Setting up the boundaries
  var maxX = width - 90;
  var maxY = height - 60;

  // Creating Views and Models
  var views = [];
  var models = [];
  for (var i = 0; i < 5; i++) {
    var model = new FishModel(maxX, maxY);
    model.place(100 * i, 100 * i);
    view = new FishView(images[0], model.x, model.y, model.reverse);
    models.push(model);
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
      var array = new Float32Array(points);
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

  // The update function - called when the fish should update its position.
  function update() {
    var buffer = new ArrayBuffer(models.length * Float32Array.BYTES_PER_ELEMENT * 2);
    var array = new Float32Array(buffer);
    for (var i = 0, s = models.length; i < s; i++) {
      var model = models[i];
      model.next();
      array[i * 2] = model.x;
      array[i * 2 + 1] = model.y;
    }
    points = buffer;
  }

  // Calls update 25 times per second.
  setInterval(update, 1000/25);

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

/*
  The Fish Model Object

  A fish object knows its bounds
  relative to its upper left corner.
  It is also given a start direction to swim in.
*/
function FishModel(maxX, maxY) {
  this.maxX = maxX;
  this.maxY = maxY;
  this.x = 0;
  this.y = 0;
  this.deltaX = 0.75 + Math.random() / 2.0;
  this.deltaY = - 0.1 + Math.random() / 5.0;
}

/* 
  Here the fish calculates a new placement
  on the basis of the direction it swims in.
  If the new position is not within the bounds, the position
  is corrected, and a new direction is set.
*/
FishModel.prototype.next = function() {
  this.y += this.deltaY;
  if (this.y < 0) {
    this.y = 0;
    this.deltaY = Math.random() / 10.0;
  } else if (this.y > this.maxY) {
    this.y = this.maxY;
    this.deltaY = - Math.random() / 10.0;
  }
  this.x += this.deltaX;
  if (this.x < 0) {
    this.x = 0;
    this.deltaX *= - 1;
    this.deltaY = - 0.1 + Math.random() / 5.0;
  } else if (this.x > this.maxX) {
    this.x = this.maxX;
    this.deltaX *= - 1;
    this.deltaY = - 0.1 + Math.random() / 5.0;
  }
};

/*
  The fish may be placed anywhere in the tank
*/
FishModel.prototype.place = function(x, y) {
  this.x = x;
  this.y = y;
};
