var express = require('express')
  , app = express()
  , server = app.listen(3000)
  , ejs = require('ejs')
  , io = require('socket.io').listen(server)
  , parseCookie = express.cookieParser('secret')
  , store = new express.session.MemoryStore()
  , db = require('./lib/db')
  , routes = require('./routes/routes')
  , lib = require('./lib/lib');

app.configure(function() {
	app.use(express.json());
	app.use(express.urlencoded());
	app.use(express.static(__dirname + '/public'));
	app.use(express.cookieParser('secret'));
	app.use(express.session({secret: 'secret', key: 'express._id', store: store}));
	app.set('views', __dirname + '/views');
	app.set('view engine', 'ejs');
	app.set('view options', { layout: false });
});

io.configure(function() {
	io.set('authorization', function(handshake, accept) {
		if (handshake.headers.cookie) {
			parseCookie(handshake, null, function(err) {
				handshake.sessionID = handshake.signedCookies['express._id'];
			});
			store.get(handshake.sessionID, function(err, session) {
				if (err || !session) {
					accept('Session not found.', false);
				} else {
					handshake.session = session;
				}
			});
		} else {
			accept('No session transmitted.', false);
		}
		accept(null, true);
	});
});


db.open(function() {
	io.sockets.on('connection', function(socket) {
		if (socket.handshake.session._id) {
			lib.getUserByID(socket.handshake.session._id, function(err, user) {
				socket.set('username', user.username);
				socket.emit('message', { 'message': 'Welcome to Chat ' + user.username, username: 'SYSTEM' });
			});
		} else {
			socket.emit('message', { message: "There was an error. Please refresh.", username: 'SYSTEM' });
		}
		socket.on('message', function(message) {
			socket.get('username', function(error, username) {
				var data = { 'message': message, username: username };
				socket.broadcast.emit('message', data);
				console.log('user ' + username + " send this : " + message);
			});
		});
		socket.on('disconnect', function() {
			socket.get('username', function (error, username) {
				socket.broadcast.emit('message', { message: username + ' has left the chat', username: "SYSTEM" });
			});
		});
	});
	app.get('/signup', routes.getSignup);
	app.get('/', routes.getLogin);
	app.get('/chat', lib.ensureAuthenticated, routes.getChat);
	app.get('/api/user/:username', routes.getUser);
	app.get('/api/users', routes.getUsers);
	app.get('/api/todo/create/:assignee/:todo', routes.createTodo);
	app.get('/api/todo/get', routes.getTodos);
	app.get('/api/todo/get/:username', routes.getAssignedTodos);
	app.get('/api/todo/toggle/:id', routes.toggleTodo);
	app.get('/api/todo/complete/:id', routes.completeTodo);
	app.get('/api/todo/incomplete/:id', routes.incompleteTodo);
	app.get('/api/todo/delete/:id', routes.deleteTodo);
	app.post('/login', routes.login);
	app.post('/signup', routes.signup);
});