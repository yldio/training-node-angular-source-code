var users = 
require('../data').users;

var password =
require("../lib/password");


module.exports = userRoutes;

function userRoutes(server) {
  server.post('/user', function(req, res, next) {

    if(!req.params.password) {
      return res.send(400,{error: "no password"});
    }
    // TODO more validation
    // TODO harden - owasp.org!

    password.encode(req.params.password,function(err,hash) {

      if(err) {
        return next(err);
      }
      
      var user = {
        _id: req.params.email,
        password: hash
      };

      users.insert(user, function(err) {
        if (err) {
          if (err.status_code == 409) {
            res.send(409, {error: {message: 'A user with that email already exists'}});
          } else {
            next(err);
          }
          return;
        }
        res.setHeader('location', '/user');
        res.send(201, {ok: true});
      });

    });

    
  });
}
