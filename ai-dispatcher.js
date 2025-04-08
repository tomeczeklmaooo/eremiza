
function send_message(type, message)
{
	var chat_window = document.getElementById('chat-window');
	var message_div = document.createElement('div');
	message_div.setAttribute('class', `chat-message-${type}`);
	message_div.innerHTML = `<strong>${type}</strong><br>${message}`;
	chat_window.appendChild(message_div);
	message_div.scrollIntoView();
}

function send_user_message()
{
	var user_message = document.getElementById('chat-input-text').value;
	send_message('user', user_message);
}