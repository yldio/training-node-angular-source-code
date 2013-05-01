var users = require('../data').users;
var password = require('../lib/password');

module.exports =
function userRoutes(server) {

  /// POST /user

  server.post('/user', function(req, res, next) {
    console.log('inserting user', req.params);
    password.encode(req.params.password, function(err, hash) {

      var user = {
        _id: req.params.email,
        password: hash
      };

      users.insert(user, function(err) {
        if (err) {
          if (err.status_code == 409)
            res.send(409, {error: {message: 'A user with that email already exists'}});
          else next(err);
          return;
        }
        res.setHeader('location', '/user');
        res.send(201, {ok: true});
      });

    });
  });
}