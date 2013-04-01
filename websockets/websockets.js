
document.addEventListener('DOMContentLoaded', setup, false);

function setup() {

  //var ws = new WebSocket("ws://tiki.io:8331");
  //var ws = new WebSocket("ws://echo.websocket.org");
  var ws = new WebSocket("ws://truffaut.local:8320");
  ws.binaryType = "arraybuffer";

  ws.onopen = function() {
    ws.send([1,2,3,4]);
  };
  ws.onmessage = function(message) {
    var array = new Int16Array(message.data);
    for (var i = 0; i < array.length; i++) {
      console.log(array[i]);
    }
  };
  ws.onerror = function(error) {
    console.log(error);
  };

  var ws2 = new WebSocket("ws://truffaut.local:8321");
  ws2.binaryType = "arraybuffer";
  
  ws2.onopen = function() {
    ws2.send([2,3,4,5]);
  };
  ws2.onmessage = function(message) {
    var array = new Int16Array(message.data);
    for (var i = 0; i < array.length; i++) {
      console.log(array[i]);
    }
  };
  ws2.onerror = function(error) {
    console.log(error);
  };

}
