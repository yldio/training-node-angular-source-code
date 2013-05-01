var users = require('../data').users;
var sessions = require('../sessions');
var password = require('../lib/password');

module.exports =
function sessionRoutes(server) {

  /// POST /user

  server.post('/session', function(req, res, next) {
    console.log('/session with params:', req.params);
    users.get(req.params.email, function(err, user) {
      if (err) {
        if (err.status_code == 404)
          res.send(404, {error: {message: 'User not found'}});
        else next(err);
        return;
      }

      password.compare(req.params.password, user.password, function(err, match) {
        if (err) return next(err);
          if (! match) return res.send(403, {error: {message: 'Invalid username / password'}});
        sessions.create(user, function(err, sessionId) {
          if (err) return next(err);
          return res.send(201, {sessionId: sessionId});
        });
      });

    });
  });
};