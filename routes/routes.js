var lib = require('../lib/lib')

module.exports = {
	getSignup: function(req, res) {
		res.render('signup', {title: "Signup for CHAT!!"});
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
	login: function(req, res) {
		lib.authenticate(req.body.username
			, req.body.password, function(err, id) {
				if (id) {
					req.session._id = id;
					res.redirect('/chat');
				} else {
					res.redirect('/login');
				}
			}
		);
	},
	signup: function(req, res) {
		if (lib.getUser(req.body.username, function(err, user) {
			if (user) return false;
			else return true; })
			&& validateEmail(req.body.email) && req.body.password && req.body.password === req.body.password2) {
			lib.createUser(req.body.username
				, req.body.email
				, req.body.password, function(err, user) {
					console.log(user);
					res.redirect('/chat');
				}
			);
		} else {
			res.redirect('/signup');
		}
	},
	createTodo: function(req, res) {
		lib.getUser(req.params.assignee, function(err, assignee) {
			lib.createTodo(req.params.todo, String(assignee._id), String(req.session._id), function(err, data) {
				if (data) {
					lib.getUserByID(String(data.assignee_id), function(err, user) {
						if (user) {
							data.assignee = user.username;
							res.send(data);
						} else res.send(false);
					});
				}
				else res.send(false);
			});			
		});
	},
	getTodos: function(req, res) {
		lib.getTodos(function(err, data) {
			if (data) res.json(data);
			else res.send(false);
		});
	},
	getAssignedTodos: function(req, res) {
		lib.getUser(req.params.username, function(err, user) {
			if (user) {
				lib.getAssignedTodos(String(user._id), function(err, data) {
					if (data) {
						res.json(data);
					} else res.send(false);
				})
			} else res.send(false);
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
			if (data) res.send('1');
			else res.send(false);
		});
	}
}

function validateEmail(email) { 
	var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	return re.test(email);
}
