
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

  var views = [];
  var models = [];

  for (var i = 0; i < 5; i++) {
    var model = new FishModel(maxX, maxY);
    model.place(100 * i, 100 * i);
    view = new FishView(images[0], model.x, model.y, model.reverse);
    models.push(model);
    views.push(view);
  }

  var points = null;

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

  setInterval(update, 1000/25);
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


function FishModel(maxX, maxY) {
  this.maxX = maxX;
  this.maxY = maxY;
  this.x = 0;
  this.y = 0;
  this.deltaX = 0.75 + Math.random() / 2.0;
  this.deltaY = - 0.1 + Math.random() / 5.0;
}

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

FishModel.prototype.place = function(x, y) {
  this.x = x;
  this.y = y;
};
