'use strict';

angular.module('todo.controllers', [])
	.controller('ChatCtrl', ['$scope', 'Todos', 'Users', 'CreateTodo', 'ToggleTodo', 'Messages',
		function($scope, Todos, Users, CreateTodo, ToggleTodo, Messages) {
			var socket = io.connect();

			socket.on('message', function(data) {
				$scope.addMessage(data.message, data.username);
				$scope.$apply();
			});
			socket.on('update', function(data) {
				$scope.todos = Todos.query();
				$scope.addMessage(data.message, data.username)
			});
			socket.on('create', function(data) {
				$scope.todos = Todos.query();
				$scope.addMessage(data.message, data.username)
			});

			$scope.todos = Todos.query();
			$scope.users = Users.query();
			$scope.messages = Messages.query();

			$scope.createTodo = function() {
				if ($scope.todoAssignee && $scope.todoText) {
					CreateTodo.get({assignee: $scope.todoAssignee, todo: $scope.todoText}, function(data) {
						console.log(data);
						socket.emit('create');
						$scope.todos = Todos.query();
					});
				} else {
					console.log('Cannot create todo without data');
				}
			};

			$scope.toggleTodo = function(id) {
				if (id) {
					ToggleTodo.get({id: id}, function(data) {
						console.log(data);
						socket.emit('update');
					});
				} else {
					console.log('No id provided to toggle todo');
				}
			};

			$scope.sendMessage = function() {
				if ($scope.messageInput) {
					socket.emit('message', $scope.messageInput);
					$scope.addMessage($scope.messageInput, 'Me');
					$scope.messageInput = '';
				} else {
					console.log('Cannot send empty message');
				}
			};

			$scope.addMessage = function(msg, username) {
				$scope.messages.push({usr: username, txt: msg});
				if ($('.chat-wrap').scrollTop() > ($('#chatEntries').height() - 250)) {
					$(".chat-wrap").scrollTop($(".chat-wrap")[0].scrollHeight);
				}
			};

	}])
	.controller('LoginCtrl', [function() {

	}]);