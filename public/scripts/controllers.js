'use strict';

angular.module('todo.controllers', [])
	.controller('ChatCtrl', ['$scope', '$location', 'Todos', 'Users', 'CreateTodo', 'DeleteTodo', 'ToggleTodo', 'Messages', 'Session',
		function($scope, $location, Todos, Users, CreateTodo, DeleteTodo, ToggleTodo, Messages, Session) {
			if (!Session.user.authenticated) {
				$location.path('/');
			}
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
			$(".chat-wrap").scrollTop($(".chat-wrap")[0].scrollHeight);

			$scope.createTodo = function() {
				if ($scope.todoAssignee && $scope.todoText) {
					CreateTodo.get({assignee: $scope.todoAssignee, todo: $scope.todoText}, function(data) {
						console.log(data);
						socket.emit('create');
						$scope.todos = Todos.query();
						$scope.todoAssignee = '';
						$scope.todoText = '';
					});
				} else {
					console.log('Cannot create todo without data');
				}
			};

			$scope.deleteTodo = function(id) {
				if (id) {
					DeleteTodo.get({id: id}, function(data) {
						console.log(data);
						socket.emit('update');
						$scope.todos = Todos.query();
					})
				}
			}

			$scope.toggleTodo = function(id) {
				if (id) {
					ToggleTodo.get({id: id}, function(data) {
						console.log(data);
						socket.emit('update');
						$scope.todos = Todos.query();
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
	.controller('LoginCtrl', ['$scope', '$location', 'Session', 
		function($scope, $location, Session) {
			$scope.userSubmit = function(user) {
				Session.login({user: user}, function(data) {
					if (!data.error) {
						$location.path('/chat');
					} else {
						alert("Login Failed");
					}
				});
			};
	}]);