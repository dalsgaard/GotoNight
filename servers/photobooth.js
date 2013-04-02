
var http = require('http');
var fs = require('fs');

var uuid = require('node-uuid');

http.createServer(function (req, res) {
  if (req.method == 'OPTIONS') {
    res.writeHead(200, "OK", {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Content-type'
    });
    res.end();
  } else if (req.method == 'POST') {
    var fn = '../photos/' + uuid.v1() + '.png';
    var f = fs.createWriteStream(fn);

    req.on('data', function(chunk) {
      f.write(chunk);
    });
      
    req.on('end', function() {
      f.end();
      res.writeHead(201, "Created", {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-type'
      });
      res.end();
    });
  } else {
    fs.readdir('../photos/', function(err, files) {
      console.log(JSON.stringify(files));
    });
    res.writeHead(200, "OK", {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Content-type'
    });
    res.end();
  }
}).listen(8320, '0.0.0.0');