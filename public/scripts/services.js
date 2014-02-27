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
				login: $resource('api/login', {}, {
						query: { method: 'POST', isArray: false }
					}),
				attempt: function(params, callback) {
					this.login.query(params, function(data) {
						Session.user = data.user;
						callback(data);
					});
				}
			};
			return Session;
		}]);
