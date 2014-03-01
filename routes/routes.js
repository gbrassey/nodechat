var lib = require('../lib/lib');

module.exports = {
	getSignup: function(req, res) {
		res.render('signup', {title: "Signup for CHAT!!"});
	},
	getTemplate: function(req, res) {
		res.render('template');
	},
	getLogin: function(req, res) {
		res.render('login', {title: "Login to CHAT!!"});
	},
	getChat: function(req, res) {
		res.render('chat', {title: "CHAT!!"});
	},
	getUser: function(req, res) {
		lib.getUser(req.params.username, function(err, user) {
			if (user)
				res.send('1');
			else
				res.send('0');
		});
	},
	getUsers: function(req, res) {
		lib.getUsers(function(err, users) {
			if (users)
				res.json(users);
			else
				res.json({error: true});
		});
	},
	login: function(req, res) {
		lib.authenticate(req.body.username
			, req.body.password, function(err, data) {
				if (data) {
					req.session._id = data._id;
					res.redirect('/chat');
				} else {
					res.redirect('/login');
				}
			}
		);
	},
	apiLogin: function(req, res) {
		lib.authenticate(req.body.user.username
			, req.body.user.password, function(err, user) {
				if (user) {
					req.session._id = user._id;
					res.json({user: { authenticated: true, username: user.username, _id: user._id }});
				} else {
					res.json({error: true});
				}
			}
		);
	},
	signup: function(req, res) {
		lib.getUser(req.body.username, function(err, user) {
			if (user === null && validateEmail(req.body.email) && req.body.password && req.body.password === req.body.password2) {
				lib.createUser(req.body.username
					, req.body.email
					, req.body.password, function(err, user) {
						res.redirect('/chat');
					}
				);
			} else {
				res.redirect('/signup');
			}
		});
	},
	createTodo: function(req, res) {
		lib.getUserByID(String(req.session._id), function(err, assigner) {
			if (assigner) {
				lib.createTodo(req.params.todo, req.params.assignee, assigner.username, function(err, data) {
					if (data) {
						res.json(data);
					} else res.json({error: true});
				});
			} else {
				res.send(false);
			}
		});
	},
	getTodos: function(req, res) {
		lib.getTodos(function(err, data) {
			if (data) res.json(data);
			else res.json({error: true});
		});
	},
	getAssignedTodos: function(req, res) {
		lib.getUser(String(req.params.username), function(err, user) {
			if (user) {
				lib.getAssignedTodos(String(user._id), function(err, data) {
					if (data) {
						res.json(data);
					} else res.json({error: true});
				})
			} else res.json({error: true});
		});
	},
	toggleTodo: function(req, res) {
		lib.getTodo(String(req.params.id), function(err, todo) {
			lib.updateTodo(String(todo._id), {complete: !(todo.complete)}, function(err, data) {
				if (data) {
					res.json({success: true});
				} else res.send(false);
			});			
		});
	},
	completeTodo: function(req, res) {
		lib.updateTodo(String(req.params.id), {complete: true}, function(err, data) {
			if (data) {
				res.send('1');
			} else res.send(false);
		});
	},
	incompleteTodo: function(req, res) {
		lib.updateTodo(String(req.params.id), {complete: false}, function(err, data) {
			if (data) {
				res.send('1');
			} else res.send(false);
		});
	},
	deleteTodo: function(req, res) {
		lib.deleteTodo(String(req.params.id), function(err, data) {
			if (data) res.json({success: true});
			else res.json({error: true});
		});
	},
	getMessages: function(req, res) {
		lib.getMessages(function(err, data) {
			if (data) {
				res.json(data);
			} else {
				res.json({error: true});
			}
		});
	}
};

function validateEmail(email) { 
	var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	return re.test(email);
}
