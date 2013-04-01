
document.addEventListener('DOMContentLoaded', setup, false);

function setup() {

  var canvas = document.querySelector('canvas');
  var ctx = canvas.getContext("2d");
  var width = canvas.width;
  var height = canvas.height;

  var fish2LR = new Image();
  fish2LR.src = '../images/fish2.png';
  var fish2RL = new Image();
  fish2RL.src = '../images/fish2r.png';

  var images = [];
  images.push([fish2LR, fish2RL]);

  var maxX = width - 90;
  var maxY = height - 60;

  var fishA = new Fish(images[0], maxX, maxY);
  var fishB = new Fish(images[0], maxX, maxY);
  fishB.place(100, 200);

  var fish = [fishA, fishB];

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

Fish.prototype.place = function(x, y, reverse) {
  this.x = x;
  this.y = y;
  this.reverse = reverse;
};
