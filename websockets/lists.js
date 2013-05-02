var duplexEmitter = require('duplex-emitter');
var authenticate = require('./authenticate');
var lists = require('../data').lists;

module.exports =
function handleLists(stream) {
  var client = duplexEmitter(stream);
  authenticate(stream, client);

  stream.on('error', function(err) {
    console.error(err);
  });

  stream.once('authenticated', function(user) {

    console.log('stream is authenticated');

    // index

    client.on('index', function() {
      lists.view('views', 'by_user', {keys: [user._id]}, function(err, lists) {
        if (err) return stream.emit('error', err);
        client.emit('index', lists.rows.map(prop('value')));
      });
    });

    // new

    client.on('new', function(list) {
      list.user = user._id;
      lists.insert(list, function(err, res) {
        if (err) return stream.emit('error', err);
        list._id = res.id;
        list._rev = res.rev;
        client.emit('new', list);
      });
    });

    // remote

    client.on('remove', function(id) {
      lists.get(id, function(err, list) {
        if (err) return stream.emit('error', err);
        if (list.user == user._id) {
          lists.destroy(list._id, list._rev, function(err) {
            if (err) return stream.emit('error', err);
            client.emit('remove', id);
          });
        } // else TODO
      });
    });
  });
}

function prop(p) {
  return function(o) {
    return o[p];
  };
}