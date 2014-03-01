'use strict';

angular.module('todo.filters', [])
    .filter('TodoFilter',
    	function () {
	        return function(todos, assignee) {
	        	assignee = assignee || '';
	        	if (assignee != '') {
					var arrayToReturn = [];        
			        for (var i=0; i<todos.length; i++){
			            if (todos[i].assignee === assignee) {
			                arrayToReturn.push(todos[i]);
			            }
			        }
			        return arrayToReturn;
	        	} else {
	        		return todos;
	        	}
	        };
    });