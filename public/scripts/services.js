'use strict';

/* Services */

var todoServices = angular.module('todo.services', ['ngResource']);

todoServices.factory('Todos', ['$resource',
		function($resource){
			return $resource('api/todo/get', {}, {
				query: {method:'GET', isArray:true}
			});
		}])
	.factory('Users', ['$resource',
		function($resource) {
			return $resource('api/users', {}, {
				query: {method:'GET', isArray:true}
			});
		}])
	.factory('CreateTodo', ['$resource',
		function($resource) {
			return $resource('api/todo/create/:assignee/:todo', {}, {
				query: {method:'GET', params:{assignee: null, todo: null}, isArray:true}
			});
		}])
	.factory('DeleteTodo', ['$resource',
		function($resource) {
			return $resource('/api/todo/delete/:id', {}, {
				query: {method:'GET', params:{id: null}, isArray: true}
			});
		}])
	.factory('ToggleTodo', ['$resource',
		function($resource) {
			return $resource('/api/todo/toggle/:id', {}, {
				query: {method:'GET', params:{id: null}, isArray: true}
			});
		}])
	.factory('Messages', ['$resource', 
		function($resource) {
			return $resource('api/chat/get', {}, {
				query: { method: 'GET', isArray: true}
			});
		}])
	.factory('Session', ['$resource',
		function($resource) {
			var Session = {
				user: {},
				checkUsername: function(username, callback) {
					$resource('api/user/:username', {}, {
						query: {method:'GET', params:{username: null}, isArray: true}
					}).get({username: username}, function(data) {
						callback(data);
					})
				},
				checkEmail: function(email, callback) {
					$resource('api/email/:email', {}, {
						query: {method:'GET', params:{email: null}, isArray: true}
					}).get({email: email}, function(data) {
						callback(data);
					})
				},
				login: function(params, callback) {
					$resource('api/login', {}, {
						query: { method: 'POST', isArray: false }
					}).query(params, function(data) {
						Session.user = data.user;
						callback(data);
					});
				},
				signup: function(params, callback) {
					$resource('api/signup', {}, {
						query: {method: 'POST', isArray: false }
					}).query(params, function(data) {
						Session.user = data.user;
						callback(data);
					});
				}
			};
			return Session;
		}]);