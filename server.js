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
app.configure('development', function () {
	app.use(express.errorHandler(
		{dumpExceptions:true, showStack:true }));
});
app.configure('production', function () {
	app.use(express.errorHandler());
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
					accept(null, true);
				}
			});
		} else {
			return accept('No session transmitted.', false);
		}
	});
});


db.open(function() {
	io.sockets.on('connection', function(socket) {
		if (socket.handshake.session._id) {
			lib.getUserByID(socket.handshake.session._id, function(err, user) {
				socket.set('username', user.username);
			});
		} else {
			socket.emit('message', { message: "There was an error. Please refresh.", username: 'SYSTEM' });
		}
		socket.on('message', function(message) {
			socket.get('username', function(error, username) {
				var data = { message: message, username: username };
				lib.addMessage(username, message, function(error, data) {
				});
				socket.broadcast.emit('message', data);
			});
		});
		socket.on('disconnect', function() {
			socket.get('username', function (error, username) {
				socket.broadcast.emit('message', { txt: username + ' has left the chat', usr: "SYSTEM" });
			});
		});
		socket.on('update', function() {
			socket.get('username', function(error, username) {
				socket.broadcast.emit('update', { txt: username + ' has updated a todo', usr: "SYSTEM" });				
			});
		});
		socket.on('create', function() {
			socket.get('username', function(error, username) {
				socket.broadcast.emit('create', { txt: username + ' has created a todo', usr: "SYSTEM" });				
			});
		});
	});
	app.get('/', routes.getTemplate);
	app.get('/api/user/:username', routes.getUser);
	app.get('/api/users', lib.ensureAuthenticated, routes.getUsers);
	app.get('/api/email/:email', routes.getEmail);
	app.get('/api/todo/create/:assignee/:todo', lib.ensureAuthenticated, routes.createTodo);
	app.get('/api/todo/get', lib.ensureAuthenticated, routes.getTodos);
	app.get('/api/todo/get/:username', lib.ensureAuthenticated, routes.getAssignedTodos);
	app.get('/api/todo/toggle/:id', lib.ensureAuthenticated, routes.toggleTodo);
	app.get('/api/todo/complete/:id', routes.completeTodo);
	app.get('/api/todo/incomplete/:id', routes.incompleteTodo);
	app.get('/api/todo/delete/:id', lib.ensureAuthenticated, routes.deleteTodo);
	app.get('/api/chat/get', lib.ensureAuthenticated, routes.getMessages);
	app.post('/login', routes.login);
	app.post('/api/login', routes.apiLogin);
	app.post('/signup', routes.signup);
	app.post('/api/signup', routes.apiSignup);
	app.use(function(req, res) { res.render('404') });
});