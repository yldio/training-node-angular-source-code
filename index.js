
var server = require("http").createServer();

var port = parseInt(process.argv[2]) || 3000;

server.listen(port);

server.once('listening', function() {
  console.log('Server is listening on port %d', port);
});

var static = require('node-static');
var Server = static.Server;

var file = new Server(__dirname + '/browser');

server.on('request', function(req, res) {
  file.serve(req, res, function(err) {
    if (err) {
      if(err.status === 404 && wantsHtml(req)) {
        file.serveFile("/index.html",200,{},req,res);
      } else {
        console.error('error processing request %s %s:',
          req.method, req.url, err);
        res.writeHead(err.status);
        res.end(err.message);
      }
    }
  });
});

function wantsHtml(req) {
  var accept = req.headers.accept || "";
  return accept.split(",").indexOf("text/html") !== -1;
}
