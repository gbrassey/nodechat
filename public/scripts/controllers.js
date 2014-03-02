'use strict';

angular.module('todo.controllers', [])
	.controller('ChatCtrl', ['$scope', '$timeout', '$location', 'Todos', 'Users', 'CreateTodo', 'DeleteTodo', 'ToggleTodo', 'Messages', 'Session',
		function($scope, $timeout, $location, Todos, Users, CreateTodo, DeleteTodo, ToggleTodo, Messages, Session) {
			if (!Session.user.authenticated) {
				$location.path('/');
			} else {
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
				$scope.todoDisplay = {day : 'today'};
				$timeout(function() {
					var chatWrap = document.getElementById('chat-wrap'),
						chatEntries = document.getElementById('chatEntries'),
						chatWrapHeight = chatWrap.offsetHeight,
						chatEntriesHeight = chatEntries.offsetHeight;
					chatWrap.scrollTop = chatEntriesHeight;
				}, 100);

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
						console.log('Cannot create todo without data.');
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
						console.log('No id provided to toggle todo.');
					}
				};

				$scope.sendMessage = function() {
					if ($scope.messageInput) {
						socket.emit('message', $scope.messageInput);
						$scope.addMessage($scope.messageInput, Session.user.username);
						$scope.messageInput = '';
					} else {
						console.log('Cannot send empty message.');
					}
				};

				$scope.addMessage = function(msg, username) {
					$scope.messages.push({usr: username, txt: msg});
					$timeout(scrollUpdate, 50);
				};


			}
			function scrollUpdate () {
				var chatWrap = document.getElementById('chat-wrap'),
					chatEntries = document.getElementById('chatEntries'),
					chatWrapHeight = chatWrap.offsetHeight,
					chatEntriesHeight = chatEntries.offsetHeight;
				if (chatWrap.scrollTop > chatEntriesHeight - chatWrapHeight - 50) {
					chatWrap.scrollTop = chatEntriesHeight;
				}
			}

	}])
	.controller('LoginCtrl', ['$scope', '$location', 'Session', 
		function($scope, $location, Session) {
			$scope.userSubmit = function(user) {
				if (user) {
					Session.login({user: user}, function(data) {
						if (!data.error) {
							$location.path('/chat');
						} else {
							alert("Login Failed.");
						}
					});
				} else {
					console.log('Please enter login information.');
				}
			};
	}])
	.controller('SignupCtrl', ['$scope', '$location', 'Session', 
		function($scope, $location, Session) {
			$scope.userSubmit = function(user) {
				if (validateEmail(user.email)) {
					Session.signup({user: user}, function(data) {
						if (!data.error) {
							$location.path('/chat');
						} else {
							console.log(data);
							alert("Signup Failed.");
						}
					});
				} else {
					$scope.emailFeedback = true;
				}
			};

			$scope.checkUsername = function(username) {
				if (username) {
					Session.checkUsername(username, function(data) {
						if (data.exists) {
							console.log('This username is already taken');
							$scope.signupForm.username.$setValidity('username', false);
						} else {
							$scope.signupForm.username.$setValidity('username', true);
						}
					});
				}
			};

			$scope.checkEmail = function(email) {
				if (email) {
					Session.checkEmail(email, function(data) {
						if (data.exists) {
							console.log('This email is already used by another account.');
							$scope.signupForm.email.$setValidity('email', false);
						} else {
							$scope.signupForm.email.$setValidity('email', true);
						}
					});
				}
			};

			function validateEmail(email) { 
				var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
				return re.test(email);
			}
	}]);