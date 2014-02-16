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

function sendTodo() {
	var todo = $("#todoInput").val(),
		assignee = $("#assignee").val();
	if (todo != "") {
		$.ajax({
			type: 'GET'
			, url: '/api/todo/create/' + assignee + '/' + todo
				}).done(function(created) {
					if (created) {
						console.log('created ' + created.todo + ' todo for ' + created.assignee);
					}
					else {
						console.log('error');
					}
		});
	}
}

$(function() {
	$("#setLogin").click(function() { setLogin() });
	$("#msgSubmit").click(function() { sendMessage(); });
	$("#todoSubmit").click(function() { sendTodo(); });
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
					$('.uname').parent('.form-group').removeClass('has-success').addClass('has-error');
					$('#usernameFeedback').text('That username is already taken. Please choose another one.');
				}
				else {
					$('.uname').parent('.form-group').removeClass('has-error').addClass('has-success');
					$('#usernameFeedback').text('');
				}
			});
		}
	});
	$('#signup .email').blur(function(e) {
		var email = $('.email').val();
		if (email) {
			if (validateEmail(email)) {
				$('.email').parent('.form-group').removeClass('has-error').addClass('has-success');
				$('#emailFeedback').text('');
			} else {
				$('.email').parent('.form-group').removeClass('has-success').addClass('has-error');
				$('#emailFeedback').text('Please use a valid Email');
			}
		}
	});
	$('#signup .password').blur(function(e) {
		var password = $('.password').val();
		if (password) {
			$('.password').parent('.form-group').removeClass('has-error').addClass('has-success');
			$('#passwordFeedback').text('');
		} else {
			$('.password').parent('.form-group').removeClass('has-success').addClass('has-error');
			$('#passwordFeedback').text('Please enter a password');
		}
	});
	$('#signup .password2').blur(function(e) {
		var password = $('.password').val();
		var password2 = $('.password2').val();
		if ($('.password').parent('.form-group').hasClass('has-success')) {
			if (password2 === password) {
				$('.password2').parent('.form-group').removeClass('has-error').addClass('has-success');
				$('#password2Feedback').text('');
			} else {
				$('.password2').parent('.form-group').removeClass('has-success').addClass('has-error');
				$('#password2Feedback').text('Password does not match');
			}
		}
	});
	$('#signup input').blur(function(e) {
		if ($('.email').parent('.form-group').hasClass('has-success') && $('.uname').parent('.form-group').hasClass('has-success') && $('.password').parent('.form-group').hasClass('has-success') && $('.password2').parent('.form-group').hasClass('has-success')) {
			$('.create-button').removeClass('disabled')
				.attr('disabled', false);
		} else {
			$('.create-button').addClass('disabled')
				.attr('disabled', true);
		}
	});
	function validateEmail(email) { 
		var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
		return re.test(email);
	}
});