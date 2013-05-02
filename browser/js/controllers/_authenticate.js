module.exports =
function authenticate(server, sessionId, $location) {

  server.on('authenticate', function() {
    window.location ='/session/new?from=' + encodeURIComponent(window.location.pathname);
  });

  server.on('authenticated', function() {
    console.log('AUITHENTICATDEDTED');
  });

  server.emit('session', sessionId);
};