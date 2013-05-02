module.exports =
function authenticate(server, sessionId, $location) {

  server.on('authenticate', function() {
    window.location ='/session/new?from=' + encodeURIComponent(window.location.pathname);
  });

  server.emit('session', sessionId);
};