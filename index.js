var server = require('http').createServer();

var port = parseInt(process.argv[2]) || 3000;
server.listen(port);

server.once('listening', function() {
  console.log('Server is listening on port %d', port);
});

/// Static file serving

var static = require('node-static');
var file = new (static.Server)(__dirname + '/browser');
server.on('request', function(req, res) {
  file.serve(req, res, function(err) {
    if (err) {
      console.error('error processing request %s %s:', req.method, req.url, err);
      res.writeHead(err.status);
      res.end(err.message);
    }
  });
});