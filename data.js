var nano = require('nano');
var db = nano('http://localhost:5984');

exports.users = db.use('users');