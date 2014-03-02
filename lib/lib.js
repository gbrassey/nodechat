var db = require('./db')
  , crypto = require('crypto')
  , ObjectID = require('mongodb').ObjectID;

module.exports = {
	authenticate: function(username, password, callback) {
		db.findOne('users', {username: username.toLowerCase()}, function(err, user) {
			if (user && (user.password === encryptPassword(password)))
				callback(err, user);
			else
				callback(err, null);
		});
	},
	ensureAuthenticated: function(req, res, next) {
		console.log(req.session);
		if (req.session._id) {
			return next();
		}
		res.redirect('/');
	},
	createUser: function(username, email, password, callback) {
		var user = {username: username.toLowerCase(), email: email
		  , password: encryptPassword(password)};
		db.insertOne('users', user, callback);
	},
	getUser: function(username, callback) {
		if (username.match (/^[0-9a-fA-F]{24}$/))
			db.findOne('users', {_id:new ObjectID(username)}, callback);
		else 
			db.findOne('users', {username: username.toLowerCase()}, callback);
	},
	getEmail: function(email, callback) {
		db.findOne('users', {email: email}, callback);
	},
	getUsers: function(callback) {
		db.findFields('users', {}, {username: true, _id: true}, 0, callback);
	},
	getUserByID: function(_id, callback) {
		db.findOne('users', {_id: new ObjectID(_id)}, callback);
	},
	createTodo: function(todo, assignee, assigner, callback) {
		var todo = {todo: todo, complete: false, assignee: assignee.toLowerCase(), assigner: assigner.toLowerCase()};
		db.insertOne('todos', todo, callback);
	},
	getTodos: function(callback) {
		db.find('todos', {}, 0, callback);
	},
	getTodo: function(_id, callback) {
		db.findOne('todos', {_id: new ObjectID(_id)}, callback);
	},
	getAssignedTodos: function(assignee_id, callback) {
		db.find('todos', {assignee: assignee.toLowerCase()}, 0, callback);
	},
	updateTodo: function(_id, update, callback) {
		db.update('todos', {_id: new ObjectID(_id)}, {$set: update}, callback);
	},
	deleteTodo: function(_id, callback) {
		db.deleteOne('todos', {_id: new ObjectID(_id)}, callback);
	},
	addMessage: function(username, message, callback) {
		db.insertOne('messages', {usr: username, txt: message}, callback);
	},
	getMessages: function(callback) {
		db.find('messages', {}, 20, callback);
	}
};

function encryptPassword(plainText) {
	return crypto.createHash('md5').update(plainText).digest('hex');
}