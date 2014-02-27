'use strict';



angular.module('todoApp', [
	'ngRoute',
	// 'todo.filters',
	'todo.services',
	// 'todo.directives',
	'todo.controllers'
]).config(['$routeProvider',
  function($routeProvider) {
    $routeProvider.
      when('/', {
        templateUrl: 'partials/login.html',
        controller: 'LoginCtrl'
      }).
      when('/chat', {
      	templateUrl: 'partials/chat.html',
      	controller: 'ChatCtrl'
      }).
      otherwise({
        redirectTo: '/'
      });
  }]);