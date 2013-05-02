var sessions = require('../sessions');

module.exports =
function authenticate(stream, client) {
  client.once('session', function(sessionId) {
    sessions.getAndRenew(sessionId, function(err, user) {
      if (err) return stream.emit('error', err);
      if (user) {
        client.emit('session', user);
        stream.emit('authenticated', user);
      } else {
        client.emit('authenticate');
      }
    });
  });
};