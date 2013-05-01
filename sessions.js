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