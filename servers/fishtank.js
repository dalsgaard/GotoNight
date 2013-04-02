
var ws = require('ws');

var WebSocketServer = ws.Server;
var wss = new WebSocketServer({port: 8320});
var wss2 = new WebSocketServer({port: 8321});

var sockets = [];

wss.on('connection', function(ws) {

  ws.on('message', function(message) {
    var array = new Int16Array(4);
    array[1] = 5;
    ws.send(array, {binary: true});
  });

  sockets.push(ws);

});

wss2.on('connection', function(ws) {
  ws.on('message', function(message) {
    console.log(message);
    var array = new Int16Array(4);
    array[2] = 6;
    ws.send(array, {binary: true});
  });
});

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

var width = 800;
var height = 600;
var maxX = width - 90;
var maxY = height - 60;

var models = [];

for (var i = 0; i < 8; i++) {
  var model = new FishModel(maxX, maxY);
  model.place(75 * i, 75 * i);
  models.push(model);
}

setInterval(update, 1000/25);
function update() {
  var array = new Float32Array(models.length * Float32Array.BYTES_PER_ELEMENT * 2);
  for (var i = 0, s = models.length; i < s; i++) {
    var model = models[i];
    model.next();
    array[i * 2] = model.x;
    array[i * 2 + 1] = model.y;
  }
  for (var i = 0, s = sockets.length; i < s; i++) {
    var ws = sockets[i];
    ws.send(array, {binary: true});
  }
}
