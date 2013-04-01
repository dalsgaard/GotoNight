
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
    ctx.drawImage(video, 0, 0, width, height);
  }, false);

}
