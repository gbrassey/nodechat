if (location.pathname=="/chat") {
	var socket = io.connect();

	socket.on('message', function(data) {
		addMessage(data['message'], data['username']);
	});
}

function addMessage(msg, username) {
	$("#chatEntries").append('<div class="message"><p><span class="username">' + username + '</span> : <span class="message">' + msg + '</span></p></div>');
	if ($('.chat-wrap').scrollTop() > ($('#chatEntries').height() - 250)) {
		$(".chat-wrap").scrollTop($(".chat-wrap")[0].scrollHeight);
	}
}

function sendMessage() {
	if ($('#messageInput').val() != "") {
		socket.emit('message', $('#messageInput').val());
		addMessage($('#messageInput').val(), 'Me', new Date().toISOString(), true);
		$('#messageInput').val('');
	}
}

function setLogin() {
	if ($("#username").val() != "" || $("#password").val() != "") {
		socket.emit('setLogin', { username: $('#username').val(), password: $('#password').val() });
		$("#chatControls").show();
		$("#login").hide();
	}
}

$(function() {
	$("#setLogin").click(function() { setLogin() });
	$("#submit").click(function() { sendMessage(); });
	$("#messageInput").keyup(function(event){
	    if(event.keyCode == 13){
	        $("#messageInput + #submit").click();
	    }
	});

	$('#signup .create-button').addClass('disabled').attr('disabled', true);

	$('#signup .uname').blur(function(e) {
		var uname = $('.uname').val();
		if (uname) {
			$.ajax({
				type: 'GET'
				, url: '/api/user/' + uname
					}).done(function(found) {
				if (found == '1') {
					$('.uname').removeClass('good').addClass('bad');
					$('#usernameFeedback').text('That username is already taken. Please choose another one.');
				}
				else {
					$('.uname').removeClass('bad').addClass('good');
					$('#usernameFeedback').text('');
				}
			});
		}
	});
	$('#signup .email').blur(function(e) {
		var email = $('.email').val();
		if (email) {
			if (validateEmail(email)) {
				$('.email').removeClass('bad').addClass('good');
				$('#emailFeedback').text('');
			} else {
				$('.email').removeClass('good').addClass('bad');
				$('#emailFeedback').text('Please use a valid Email');
			}
		}
	});
	$('#signup .password').blur(function(e) {
		var password = $('.password').val();
		if (password) {
			$('.password').removeClass('bad').addClass('good');
			$('#passwordFeedback').text('');
		} else {
			$('.password').removeClass('good').addClass('bad');
			$('#passwordFeedback').text('Please enter a password');
		}
	});
	$('#signup .password2').blur(function(e) {
		var password = $('.password').val();
		var password2 = $('.password2').val();
		if ($('.password').hasClass('good')) {
			if (password2 === password) {
				$('.password2').removeClass('bad').addClass('good');
				$('#password2Feedback').text('');
			} else {
				$('.password2').removeClass('good').addClass('bad');
				$('#password2Feedback').text('Password does not match');
			}
		}
	});
	$('#signup input').blur(function(e) {
		if ($('.email').hasClass('good') && $('.uname').hasClass('good') && $('.password').hasClass('good') && $('.password2').hasClass('good')) {
			$('.create-button').removeClass('disabled')
				.attr('disabled', false);
		} else {
			$('.create-button').addClass('disabled')
				.attr('disabled', true);
		}
	})
	function validateEmail(email) { 
		var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
		return re.test(email);
	}
});