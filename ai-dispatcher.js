
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
