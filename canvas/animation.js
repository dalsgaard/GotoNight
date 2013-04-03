
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

  // Setting up some fish
  var fishA = new Fish(images[0], maxX, maxY);
  var fishB = new Fish(images[0], maxX, maxY);
  fishB.place(100, 200);
  var fish = [fishA, fishB];

  // The draw function - called when a new frame should be drawn
  function draw() {
    ctx.clearRect(0, 0, width, height);
    for (var i = 0, s = fish.length; i < s; i++) {
      fish[i].draw(ctx);
    }
    window.requestAnimationFrame(function() {
      draw();
    });
  }
  draw();

}

/*
  The Fish Object

  A fish object has a left- and a right image, and it knows its bounds
  relative to its upper left corner.
  It is also given a start direction to swim in.
*/
function Fish(images, maxX, maxY) {
  this.imageLR = images[0];
  this.imageRL = images[1];
  this.maxX = maxX;
  this.maxY = maxY;
  this.x = 0;
  this.y = 0;
  this.deltaX = 0.75 + Math.random() / 2.0;
  this.deltaY = - 0.1 + Math.random() / 5.0;
  this.reverse = false;
}

/* 
  Here the fish draws itself. A new placement is calculated
  on the basis of the direction it swims in.
  If the new position is not within the bounds, the position
  is corrected, and a new direction is set.
*/
Fish.prototype.draw = function(ctx) {
  this.y += this.deltaY;
  if (this.y < 0) {
    this.y = 0;
    this.deltaY = Math.random() / 10.0;
  } else if (this.y > this.maxY) {
    this.y = this.maxY;
    this.deltaY = - Math.random() / 10.0;
  }
  this.x += this.deltaX;
  if (this.reverse) {
    if (this.x < 0) {
      this.x = 0;
      this.deltaX *= - 1;
      this.deltaY = - 0.1 + Math.random() / 5.0;
      this.reverse = false;
    }
  } else {
    if (this.x > this.maxX) {
      this.x = this.maxX;
      this.deltaX *= - 1;
      this.deltaY = - 0.1 + Math.random() / 5.0;
      this.reverse = true;
    }
  }
  var image = this.reverse ? this.imageRL : this.imageLR;
  ctx.drawImage(image, this.x, this.y);
};

/*
  The fish may be placed anywhere in the tank
*/
Fish.prototype.place = function(x, y, reverse) {
  this.x = x;
  this.y = y;
  this.reverse = reverse;
};
