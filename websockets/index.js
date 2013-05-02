var shoe = require('shoe');

var roots = ['lists', 'todos'];

exports.install =
function install(server) {

  /// Hack the server to allow Sockjs
  /// to live with Restify
  hack(server);

  /// Install websockets
  roots.forEach(function(root) {
    var handler = require('./' + root);
    var sock = shoe(handler);
    sock.install(server.server, '/' + root);
  });

};


/// Hack Restify to allow Sockjs
function hack(server) {
  /// Hack
  server.server.removeAllListeners('request');
  server.server.on('request', function onRequest(req, res) {
    var handled = false;
    for (var i = 0 ; i < roots.length && ! handled; i ++) {
      var root = roots[i];
      if (req.url.indexOf('/' + root) == 0) {
        handled = true;
        CORS(res);
      }
    }
    if (! handled) {
      server._setupRequest(req, res);
      server._handle(req, res);
    }
  });
}

/// CORS

var allowHeaders = ['Accept', 'Accept-Version', 'Content-Type', 'Api-Version', 'Origin', 'X-Requested-With']; // added Origin & X-Requested-With
var methods = ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'];

function CORS(res) {
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Headers', allowHeaders.join(', '));
  res.setHeader('Access-Control-Allow-Methods', methods.join(', '));
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
}