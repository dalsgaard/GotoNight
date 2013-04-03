
var ws = require('ws');

// Setting up the WebSocket Server
var WebSocketServer = ws.Server;
var wss = new WebSocketServer({port: 8321});

// The incomming sockets
var sockets = [];

// When a connection is established.
wss.on('connection', function(ws) {

  // When a message is received.
  ws.on('message', function(message) {
  });

  // Add the new socket to the list of incomming sockets.
  sockets.push(ws);

});


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


// Setting up the tank's dimensions
var width = 800;
var height = 600;
var maxX = width - 90;
var maxY = height - 60;


// Creating Models
var models = [];
for (var i = 0; i < 8; i++) {
  var model = new FishModel(maxX, maxY);
  model.place(75 * i, 75 * i);
  models.push(model);
}

// The update function - called when the fish should update its position.
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

// Calls update 25 times per second.
setInterval(update, 1000/25);
