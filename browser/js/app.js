var App = angular.module('ToodooApp', ['ngResource', 'ngCookies']);

App.config(function($locationProvider, $routeProvider) {
  $locationProvider.html5Mode(true);

  $routeProvider.
    when('/', {
      templateUrl: '/partials/index.html'
    }).
    when('/user/new', {
      templateUrl: '/partials/user/new.html',
      controller: 'NewUserCtrl'
    }).
    when('/user/welcome', {
      templateUrl: '/partials/user/welcome.html'
    }).
    when('/session/new', {
      templateUrl: '/partials/session/new.html',
      controller: 'NewSessionCtrl'
    }).
    when('/lists', {
      templateUrl: '/partials/lists/index.html',
      controller: 'ListsCtrl'
    });
});

App.factory('UserRes', function($resource, $http) {
  $http.useXDomain = true;

  return $resource('http://localhost\\:3001/user');
});

App.factory('SessionRes', function($resource, $http) {
  $http.useXDomain = true;

  return $resource('http://localhost\\:3001/session');
});


/// Web Sockets

var reconnect = require('reconnect');
var duplexEmitter = require('duplex-emitter');

App.factory('Websocket', function() {

  function connect(path, cb) {
    reconnect(function(stream) {
      var server = duplexEmitter(stream);
      cb(server);
    }).connect(path);
  }

  return {
    connect: connect
  };

});