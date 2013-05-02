var restify = require('restify');
var server = restify.createServer();


/// Middleware
server.use(restify.CORS());
server.use(restify.requestLogger());
server.use(restify.acceptParser(server.acceptable));
server.use(restify.dateParser());
server.use(restify.authorizationParser());
server.use(restify.queryParser());
server.use(restify.gzipResponse());
server.use(restify.bodyParser());

/// Routes
require('./routes')(server);


/// Listen
var port = parseInt(process.argv[2]) || 3001;

server.listen(port);

server.once('listening', function() {
  console.log('API Server is listening on port %d', port);
});

/// CORS support

server.on('MethodNotAllowed', require('./api_unknown_method_handler')());


/// Websockets

var websockets = require('./websockets');
websockets.install(server);