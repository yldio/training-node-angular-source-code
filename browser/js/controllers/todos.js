var authenticate = require('./_authenticate');

window.TodosCtrl =
function TodosCtrl($scope, Websocket, $location, $routeParams) {

  $scope.newtodo = {};
  $scope.todos = [];

  Websocket.connect('http://localhost:3001/todos', function(server) {

    authenticate(server, $.jStorage.get('session'), $location);

    server.once('session', function(user) {

      /// List

      server.emit('list', $routeParams.listId);

      server.on('list', function(list) {
        $scope.list = list;
      });

      /// Create

      $scope.create = function create() {
        server.emit('new', $scope.newtodo);
        $scope.newtodo = {};
      };

      server.on('new', function(todo) {
        $scope.todos.push(todo);
        $scope.$digest();
      });

      /// Index

      server.emit('index');

      server.on('index', function(todos) {
        $scope.todos = todos;
        $scope.$digest();
      });

      /// Remove

      $scope.remove = function remove(list) {
        server.emit('remove', list._id);
      };

      server.on('remove', function(id) {
        var pos = find(id);
        if (pos > -1) $scope.todos.splice(pos, 1);
        $scope.$digest();
      });

      /// update and toggle

      $scope.toggle = function toggle(todo) {
        todo.state = todo.state == 'pending' ? 'done' : 'pending';
        server.emit('update', todo);
      };

      server.on('update', function(todo) {
        var pos = find(todo._id);
        if (pos > -1) $scope.todos[pos] = todo;
        $scope.$digest();
      });

      /// search and filter

      $scope.resetSearch = function() {
        $scope.setSearch(null);
      };

      $scope.setSearch = function(state) {
        $location.search('state', state);
      };

      function captureStateFilter() {
        $scope.stateFilter = $location.search().state;
      }

      $scope.location = $location;
      $scope.$watch('location.search().state', captureStateFilter);

    });
  });

  function find(id) {
    var todos = $scope.todos;
    for (var i = 0; i < todos.length; i++) {
      if (todos[i]._id == id) return i;
    }
    return -1;
  }
};