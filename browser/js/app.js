

var App = angular.module("ToodooApp",
  ["ngRoute",
   "ngResource"]);

App.config(function($locationProvider,$routeProvider) {

  // turn on push-state
  $locationProvider.html5Mode(true);

  $routeProvider
    .when("/",{
      templateUrl: "/partials/index.html"
    })
    .when("/users/new",{
      templateUrl: "/partials/users-new.html",
      controller: "NewUserCtrl"
    })
    .when("/lists",{
      templateUrl: 
        "/partials/lists.html",
      controller: "ListsCtrl"
    })
    .otherwise({
      templateUrl: "/partials/what-the-fu.html"
    });

});

App.controller("NewUserCtrl",
  function($scope,UserRes,$location) {

    $scope.user = new UserRes;

    $scope.create = function() {
      $scope.submitting = true;
      $scope.user.$save(success,error);
    };

    function success() {
      $scope.submitting = false;
      $location.url("/user/welcome");
    }

    function error(err) {
      $scope.$emit("error",{
        message: "Unfortunately we had a problem signing you up"
      });
    }

  });

App.factory("UserRes",function($resource,$http) {
  // return a constructor for user instances
  return $resource("http://localhost\\:3001/user");
});


App.controller("ErrorCtrl",function($rootScope,$scope) {
  $rootScope.$on("error",function(evt,error) {
    $scope.error = error.message;
  });
  $scope.dismiss = function() {
    delete $scope.error;
  }
  $rootScope.$on('$routeChangeStart', function() {
    delete $scope.error;
  });
});

App.controller("ListsCtrl",ListsCtrl);

function ListsCtrl($scope, Websocket, $location) {

  $scope.newlist = {};
  $scope.lists = [];

  Websocket.connect($scope, 'http://localhost:3001/lists', function(server) {

    $scope.create = function create() {
      console.log($scope.newlist);
      server.emit('new', $scope.newlist);
      $scope.newlist = {};
    };

    // TODO change to 'created'
    server.on("new",function(list) {
      $scope.lists.push(list);
      $scope.$apply();
    });

  });

}


/// Web Sockets

var reconnect = require('reconnect');
var duplexEmitter = require('duplex-emitter');

App.factory('Websocket', function() {

  function connect(scope, path, cb) {
    var r =
    reconnect(function(stream) {

      scope.$on('$destroy', function() {
        r.reconnect = false;
        stream.end();
      });

      var server = duplexEmitter(stream);
      cb(server);

    }).connect(path);
  }

  return {
    connect: connect
  };

});
