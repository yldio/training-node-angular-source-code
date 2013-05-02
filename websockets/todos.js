var duplexEmitter = require('duplex-emitter');
var authenticate = require('./authenticate');
var lists = require('../data').lists;
var todos = require('../data').todos;

module.exports =
function handleLists(stream) {
  var client = duplexEmitter(stream);
  authenticate(stream, client);

  stream.on('error', function(err) {
    console.error(err);
  });

  stream.once('authenticated', function(user) {

    client.on('list', function(listId) {

      lists.get(listId, function(err, list) {
        if (err) return stream.emit('error', err);
        client.emit('list', list);
      });

      // index

      client.on('index', function() {
        todos.view('views', 'by_list', {keys: [listId]}, function(err, lists) {
          if (err) return stream.emit('error', err);
          client.emit('index', lists.rows.map(prop('value')));
        });
      });

      // new

      client.on('new', function(todo) {

        todo.list = listId;
        todo.state = 'pending';

        todos.insert(todo, function(err, res) {
          if (err) return stream.emit('error', err);
          todo._id = res.id;
          todo._rev = res.rev;
          client.emit('new', todo);
        });
      });

      // remove

      client.on('remove', function(id) {
        todos.get(id, function(err, todo) {
          if (err) return stream.emit('error', err);
          if (todo.list == listId) {
            todos.destroy(todo._id, todo._rev, function(err) {
              if (err) return stream.emit('error', err);
              client.emit('remove', id);
            });
          } // else TODO
        });
      });

      // update

      client.on('update', function(todo) {
        todos.insert(todo, function(err, res) {
          if (err) return stream.emit('error', err);
          todo._id = res.id;
          todo._rev = res.rev;
          client.emit('update', todo);
        });
      });


    });

  });
}

function prop(p) {
  return function(o) {
    return o[p];
  };
}