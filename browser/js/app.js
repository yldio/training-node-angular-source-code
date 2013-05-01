var App = angular.module('ToodooApp', ['ngResource']);

App.config(function($locationProvider, $routeProvider) {
  $locationProvider.html5Mode(true);

  $routeProvider.
    when('/', {
      templateUrl: '/partials/index.html'
    }).
    when('/user/new', {
      templateUrl: '/partials/user/new.html',
      controller: 'NewUserCtrl'
    });
});

App.factory('UserRes', function($resource) {
  return $resource('/user');
});