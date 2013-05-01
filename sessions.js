var redis = require('redis');
var uuid = require('node-uuid').v4;

var client = redis.createClient();

var ttl_secs = 60 * 60; // 1 hour
var prefix = 'session:';

exports.create =
function createSession(user, cb) {
  var sessionId = uuid();
  var key = prefix + sessionId;
  client.multi()
    .set(key, JSON.stringify(user))
    .expire(key, ttl_secs)
    .exec(function(err) {
      cb(err, sessionId);
    });
};

exports.getAndRenew =
function getAndRenewSession(sessionId, cb) {
  var key = prefix + sessionId;
  client.get(key, function(err, user) {
    if (err) return cb(err);
    if (user) {
      user = JSON.parse(user);
      // renew session
      client.expire(key, ttl_secs);
    }
    cb(null, user);
  });
};