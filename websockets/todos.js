var duplexEmitter = require('duplex-emitter');
var authenticate = require('./authenticate');
var lists = require('../data').lists;
var todos = require('../data').todos;
var hub = require('./hub');

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

      // emit
      var eventKeyPrefix = 'list:' + listId + ':';
      function emit(e) {
        var args = Array.prototype.slice.apply(arguments);
        args[0] = eventKeyPrefix + e;
        hub.emit.apply(hub, args);
      }

      // propagate events

      ['new', 'remove', 'update'].forEach(function(event) {

        function propagator() {
          var args = Array.prototype.slice.apply(arguments);
          args.unshift(event);
          client.emit.apply(client, args);
        }

        var hubEvent = eventKeyPrefix + event;
        hub.on(hubEvent, propagator);

        // Stop propagation once stream ends
        stream.once('end', function() {
          hub.removeListener(hubEvent, propagator);
        });

      });

      var oldClientEmit = client.emit;
      client.emit = function emit() {
        oldClientEmit.apply(client, arguments);
      };

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
          emit('new', todo);
        });
      });

      // remove

      client.on('remove', function(id) {
        todos.get(id, function(err, todo) {
          if (err) return stream.emit('error', err);
          if (todo.list == listId) {
            todos.destroy(todo._id, todo._rev, function(err) {
              if (err) return stream.emit('error', err);
              emit('remove', id);
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
          emit('update', todo);
        });
      });


    });

  });
}

/// Utils

function prop(p) {
  return function(o) {
    return o[p];
  };
}