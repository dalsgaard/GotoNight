
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

  var body = document.querySelector('body');
  body.classList.add('taking');

  function takeImage() {
    _.each(document.querySelectorAll('canvas'), function(canvas) {
      var ctx = canvas.getContext("2d");
      var width = canvas.width;
      var height = canvas.height;
      ctx.drawImage(video, 0, 0, width, height);
    });
  }

  var imageCanvas = document.querySelector('section.image canvas');
  _.each(document.querySelectorAll('section.filters canvas'), function(canvas) {
    canvas.addEventListener('click', function() {
      imageCanvas.className = canvas.className;
    });
  });

  var take = document.querySelector('button.take');
  take.addEventListener('click', function() {
    takeImage();
    body.classList.remove('taking');
  }, false);

  var del = document.querySelector('button.delete');
  del.addEventListener('click', function() {
    body.classList.add('taking');
  }, false);

  var upload = document.querySelector('button.upload');
  upload.addEventListener('click', function() {
    var xhr = new XMLHttpRequest();
    xhr.open('POST', 'http://0.0.0.0:8320', true);
    xhr.onload = function(e) {
      console.log(this.status);
    };
    var ctx = imageCanvas.getContext("2d");
    imageCanvas.toBlob(function (blob) {
      xhr.send(blob);
    });
  }, false);

}
