var duplexEmitter = require('duplex-emitter');
var lists = require('../data').lists;

var user = require("../user");

module.exports =
function handleLists(stream) {
  var client = duplexEmitter(stream);
  console.log("Websockets for lists enabling");

  stream.on('error', function(err) {
    console.error(err);
  });

  client.on('index', function() {
    // give me all lists so far
    lists.view('views', 'by_user', {keys: [user._id]}, function(err, lists) {
      if(err) return fail(err);
       client.emit('index', lists.rows.map(function(row) {
         return row.value;
       }));
    });
  });

  client.on('new', function(list) {
    // making a new list
    list.user = user._id;
    lists.insert(list, function(err, res) {
      if (err) return fail(err);
      list._id = res.id;
      list._rev = res.rev;
      client.emit('new', list);
    });
  });

  client.on('remove', function(id) {
    // remove old list
  });


  function fail(err) {
    stream.emit("error",err);
  }
}

