
function send_message(type, message)
{
	var chat_window = document.getElementById('chat-window');
	var message_div = document.createElement('div');
	var sender = (type === 'user') ? 'demo' : 'Dyspozytor AI';
	var date = new Date();
	var year = lt10(date.getFullYear());
	var month = lt10(date.getMonth() + 1);
	var day = lt10(date.getDate());
	var hour = lt10(date.getHours());
	var minute = lt10(date.getMinutes());
	var second = lt10(date.getSeconds());
	var timestamp = `${day}/${month}/${year} ${hour}:${minute}:${second}`;
	message_div.setAttribute('class', `chat-message-${type}`);
	message_div.innerHTML = `<strong>${sender}</strong>&emsp;<span class="timestamp">${timestamp}</span><br>${message}`;
	chat_window.appendChild(message_div);
	chat_window.scrollTop = chat_window.scrollHeight;
}

function send_user_message()
{
	var user_message = document.getElementById('chat-input-text').value;
	send_message('user', user_message);
	setTimeout(function() {
		get_ai_response();
	}, 1000);
}

function get_ai_response()
{
	var random = random_int(0, 2);
	send_message('ai', ai_responses.unrecognizable_message[random]);
}

const ai_responses = {
	// GREETING MESSAGES
	greet: [
		"Cześć! W czym mogę pomóc?",
		"Witaj! W czym mogę pomóc?"
	],
	// FAREWELL MESSAGES
	farewell: [
		"Miło było Ci pomóc!",
		"Do zobaczenia wkrótce!",
		"Bye bye!"
	],
	// STATUS MESSAGES
	status: [
		"Wskazana przez ciebie jednostka ma status OCZEKIWANIE NA ALARM",
		"Wskazana przez ciebie jednostka ma status WYJAZD NA AKCJĘ",
		"Wskazana przez ciebie jednostka miała ostatni alarm DATA+GODZINA",
		"Wskazana przez ciebie jednostka nie istnieje."
	],
	// UNRECOGNIZABLE_USER_MESSAGE MESSAGES
	unrecognizable_message: [
		"Nie rozumiem. Napisz jeszcze raz.",
		"Nie mogę rozpoznać słów kluczowych w twojej wiadomości. Spróbuj ponownie.",
		"Nie mogę odpowiedzieć na twoją wiadomość, brakuje w niej informacji."
	]
};
