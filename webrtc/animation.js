
document.addEventListener('DOMContentLoaded', setup, false);

function setup() {

  var video = document.querySelector('video');

  navigator.webkitGetUserMedia({video: true}, success, fail);

  function fail(error) {
    console.log("Oh no!", error);
  }

  function success(localMediaStream) {
    video.src = window.URL.createObjectURL(localMediaStream);

    video.onloadedmetadata = function(e) {
      console.log('Wow!')
    }
  }

  var canvas = document.querySelector('canvas');
  var ctx = canvas.getContext("2d");
  var width = canvas.width;
  var height = canvas.height;

  canvas.addEventListener('click', function() {
    shuffled = _.shuffle(_.range(9));
  }, false);

  var shuffled = _.shuffle(_.range(9));

  function draw() {
    ctx.clearRect(0, 0, width, height);
    var w = width / 3.0;
    var h = height / 3.0;
    for (var i = 0; i < 9; i++) {
      var x1 = (i % 3) * w
      var y1 = Math.floor(i / 3) * h;
      var s = shuffled[i];
      var x2 = (s % 3) * w
      var y2 = Math.floor(s / 3) * h;
      ctx.drawImage(video, x1, y1, w, h, x2, y2, w, h);
    }
    window.requestAnimationFrame(function() {
      draw();
    });
  }
  draw();

}
