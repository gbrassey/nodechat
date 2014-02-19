// public/core.js
var scotchTodo = angular.module('todo', []);

function mainController($scope, $http) {
	$scope.formData = {};

	// when landing on the page, get all todos and show them
	$http.get('/api/todo/get')
		.success(function(data) {
			$scope.todos = data;
			console.log(data);
		})
		.error(function(data) {
			console.log('Error: ' + data);
		});
	
	$http.get('/api/users')
		.success(function(data) {
			$scope.users = data;
			console.log(data);
		})
		.error(function(data) {
			console.log('Error: ' + data);
		});

	// when submitting the add form, send the text to the node API
	// $scope.createTodo = function() {
	// 	$http.post('/api/todo/create/:assignee/:todo', $scope.formData)
	// 		.success(function(data) {
	// 			$scope.formData = {}; // clear the form so our user is ready to enter another
	// 			$scope.todos = data;
	// 			console.log(data);
	// 		})
	// 		.error(function(data) {
	// 			console.log('Error: ' + data);
	// 		});
	// };

	// delete a todo after checking it
	$scope.toggleTodo = function(id) {
		$http.get('/api/todo/toggle/' + id)
			.success(function(data) {
				console.log('Todo Updated');
			})
			.error(function(data) {
				console.log('Error: ' + data);
			});
	};

}