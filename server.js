var express = require('express')
  , app = express()
  , server = app.listen(3000)
  , jade = require('jade')
  , io = require('socket.io').listen(server);

app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.set('view options', { layout: false });
app.configure(function() {
	app.use(express.static(__dirname + '/public'));
});
app.get('/', function(req, res) {
	res.render('home.jade');
});

io.sockets.on('connection', function(socket) {
	socket.on('setPseudo', function(data) {
		socket.set('pseudo', data);
		socket.broadcast.emit('message', { message: data + ' has joined the chat', pseudo: 'ADMIN' });
	});
	socket.on('message', function(message) {
		socket.get('pseudo', function(error, name) {
			var data = { 'message': message, pseudo: name };
			socket.broadcast.emit('message', data);
			console.log('user ' + name + " send this : " + message);
		});
	});
	socket.on('disconnect', function() {
		socket.get('pseudo', function (error, name) {
			socket.broadcast.emit('message', { message: name + ' has left the chat', pseudo: "ADMIN" });
		});
	});
});