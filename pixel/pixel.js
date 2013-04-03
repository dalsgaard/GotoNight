
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

  var imageCanvas = document.querySelector('section.image canvas');
  var normalCanvas = document.createElement("canvas");
  normalCanvas.width = 400;
  normalCanvas.height = 300;

  var brightnessCanvas = document.querySelector('canvas.brightness');
  var grayscaleCanvas = document.querySelector('canvas.grayscale');

  brightnessCanvas.addEventListener('click', function() {
    
  }, false);

  function imageToCanvas(canvas, image) {
    var ctx = canvas.getContext("2d");
    var width = canvas.width;
    var height = canvas.height;
    ctx.drawImage(image, 0, 0, width, height);
  }

  brightnessCanvas.addEventListener('click', function() {
    imageToCanvas(imageCanvas, normalCanvas);
    brightness(imageCanvas, 50);
  }, false);

  grayscaleCanvas.addEventListener('click', function() {
    imageToCanvas(imageCanvas, normalCanvas);
    grayscale(imageCanvas);
  }, false);

  document.querySelector('canvas.normal').addEventListener('click', function() {
    imageToCanvas(imageCanvas, normalCanvas);
  }, false);

  function takeImage() {
    imageToCanvas(normalCanvas, video);
    _.each(document.querySelectorAll('canvas'), function(canvas) {
      imageToCanvas(canvas, normalCanvas);
    });
    brightness(brightnessCanvas, 50);
    grayscale(grayscaleCanvas);
  }

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
    xhr.open('POST', 'http://0.0.0.0:8322', true);
    xhr.onload = function(e) {
      console.log(this.status);
      alert('Done');
    };
    var ctx = imageCanvas.getContext("2d");
    imageCanvas.toBlob(function (blob) {
      xhr.send(blob);
    });
  }, false);

}

// Filters

function brightness(canvas, adjustment) {
  var ctx = canvas.getContext("2d");
  var width = canvas.width;
  var height = canvas.height;
  var pixels = ctx.getImageData(0, 0, width, height);
  var data = pixels.data;
  for (var i = 0; i < data.length; i += 4) {
    data[i] += adjustment;
    data[i+1] += adjustment;
    data[i+2] += adjustment;
  }
  ctx.putImageData(pixels, 0, 0);
}

function grayscale(canvas) {
  var ctx = canvas.getContext("2d");
  var width = canvas.width;
  var height = canvas.height;
  var pixels = ctx.getImageData(0, 0, width, height);
  var data = pixels.data;
  for (var i = 0; i < data.length; i += 4) {
    var r = data[i];
    var g = data[i+1];
    var b = data[i+2];
    // CIE luminance for the RGB
    // The human eye is bad at seeing red and blue, so we de-emphasize them.
    var v = 0.2126 * r + 0.7152 * g + 0.0722 * b;
    data[i] = data[i+1] = data[i+2] = v
  }
  ctx.putImageData(pixels, 0, 0);
}
