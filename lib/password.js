var bcrypt = require('bcrypt');

exports.encode =
function encode(password, cb) {
  bcrypt.genSalt(10, function(err, salt) {
    if (err) return cb(err);
    bcrypt.hash(password, salt, cb);
  });
};

exports.compare =
function compare(password, hash, cb) {
  bcrypt.compare(password, hash, cb);
};