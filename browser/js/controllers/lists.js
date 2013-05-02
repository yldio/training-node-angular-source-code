var authenticate = require('./_authenticate');

window.ListsCtrl =
function ListsCtrl($scope, Websocket, $location) {

  $scope.newlist = {};
  $scope.lists = [];

  Websocket.connect('http://localhost:3001/lists', function(server) {

    authenticate(server, $.jStorage.get('session'), $location);

    server.once('session', function(user) {

      /// Create

      $scope.create = function create() {
        server.emit('new', $scope.newlist);
        $scope.newlist = {};
      };

      server.on('new', function(list) {
        $scope.lists.push(list);
        $scope.$digest();
      });

      /// Index

      server.emit('index');

      server.on('index', function(lists) {
        $scope.lists = lists;
        $scope.$digest();
      });

      /// Remove

      $scope.remove = function remove(list) {
        server.emit('remove', list._id);
      };

      server.on('remove', function(id) {
        var pos = find(id);
        if (pos > -1) $scope.lists.splice(pos, 1);
        $scope.$digest();
      });
    });
  });

  function find(id) {
    var lists = $scope.lists;
    for (var i = 0; i < lists.length; i++) {
      if (lists[i]._id == id) return i;
    }
    return -1;
  }
};