'use strict';

angular.module('todo.filters', [])
    .filter('TodoFilter',
    	function () {
	        return function(todos, assignee, day) {
	        	assignee = assignee || '';
	        	day = day || '';
	        	var date = Date.parse(new Date());

	        	function filterAssignee (todos, assignee) {
					var arrayToReturn = [];
			        for (var i=0; i<todos.length; i++){
			            if (todos[i].assignee === assignee) {
			                arrayToReturn.push(todos[i]);
			            }
			        }
			        return arrayToReturn;
	        	}
	        	if (assignee != '') {
	        		todos = filterAssignee(todos, assignee);
	        	}

	        	function filterDay(todos, day) {
	        		var arrayToReturn = [];
	        		var offsetDate = (day === 'yesterday') ? -1 : 0;
	        		var filterDate = new Date();
	        		filterDate.setDate(filterDate.getDate() + offsetDate);
	        		for (var i=0; i<todos.length; i++) {
	        			var todoDate = new Date(todos[i].date);
	        			if (todoDate.getFullYear() === filterDate.getFullYear() && todoDate.getMonth() === filterDate.getMonth() &&
	        				todoDate.getDate() === filterDate.getDate()) {
		        			arrayToReturn.push(todos[i]);
		        		}
	        		}
	        		return arrayToReturn;
	        	}
	        	if (day) {
	        		todos = filterDay(todos, day);
				}

        		return todos;
	        };
    });