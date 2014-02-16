var db = require('./db')
  , crypto = require('crypto')
  , ObjectID = require('mongodb').ObjectID;

module.exports = {
	authenticate: function(username, password, callback) {
		db.findOne('users', {username: username}, function(err, user) {
			if (user && (user.password === encryptPassword(password)))
				callback(err, user._id);
			else
				callback(err, null);
		});
	},
	ensureAuthenticated: function(req, res, next) {
		if (req.session._id) {
			return next();
		}
		res.redirect('/');
	},
	createUser: function(username, email, password, callback) {
		var user = {username: username, email: email
		  , password: encryptPassword(password)};
		db.insertOne('users', user, callback);
	},
	getUser: function(username, callback) {
		db.findOne('users', {username: username}, callback);
	},
	getUserByID: function(_id, callback) {
		db.findOne('users', {_id: new ObjectID(_id)}, callback);
	},
	createTodo: function(todo, assignee_id, assigner_id, callback) {
		var todo = {todo: todo, complete: false, assignee_id: new ObjectID(assignee_id), assigner_id: new ObjectID(assigner_id)};
		db.insertOne('todos', todo, callback);
	},
	getTodos: function(callback) {
		db.find('todos', {}, 0, callback);
	},
	getTodo: function(_id, callback) {
		db.findOne('todos', {_id: new ObjectID(_id)}, callback);
	},
	getAssignedTodos: function(assignee_id, callback) {
		db.find('todos', {assignee_id: new ObjectID(assignee_id)}, 0, callback);
	},
	updateTodo: function(_id, update, callback) {
		db.update('todos', {_id: new ObjectID(_id)}, {$set: update}, callback);
	},
	deleteTodo: function(_id, callback) {
		db.deleteOne('todos', {_id: new ObjectID(_id)}, callback);
	}
}

function encryptPassword(plainText) {
	return crypto.createHash('md5').update(plainText).digest('hex');
}