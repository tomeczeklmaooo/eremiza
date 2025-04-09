var user_message = document.getElementById('chat-input-text');
var stored_user_message = '';

const keywords = {
	// GREETING KEYWORDS
	greet: [
		'cześć',
		'hej',
		'witaj',
		'hello',
		'hi',
		'yo',
		'dobry', // dzień dobry
		'siema',
		'hey',
		'greetings',
		'howdy',
		'halo',
		'yo!',
		'witam',
		'hallo',
		'salut',
		'hejka'
	],
	// FAREWELL KEYWORDS
	farewell: [
		'widzenia', // do widzenia
		'bye',
		'pa',
		'zobaczenia', // do zobaczenia
		'żegnaj',
		'goodbye',
		'see',
		'take',
		'care',
		'razie',
		'adieu',
		'sayonara',
		'bye-bye',
		'day',
		'farewell',
		'long',
		'time',
		'peace',
		'ciao',
		'later',
		'thanks',
		'dzięki',
		'dziena'
	],
	// STATUS KEYWORDS
	status: [
		'status',
		'alarm',
	],
	// FUN KEYWORDS
	fun: [
		'meow'
	]
};

const ai_responses = {
	// GREETING MESSAGES
	greet: [
		'Cześć! W czym mogę pomóc?',
		'Witaj! W czym mogę pomóc?'
	],
	// FAREWELL MESSAGES
	farewell: [
		'Miło było Ci pomóc!',
		'Do zobaczenia wkrótce!',
		'Bye bye!'
	],
	// STATUS MESSAGES
	status: [
		'Wskazana przez ciebie jednostka ma status OCZEKIWANIE NA ALARM',
		'Wskazana przez ciebie jednostka ma status WYJAZD NA AKCJĘ',
		'Wskazana przez ciebie jednostka miała ostatni alarm DATA+GODZINA'
	],
	// FUN RESPONSES
	fun: [
		'meow'
	],
	// UNRECOGNIZABLE_USER_MESSAGE MESSAGES
	unrecognizable_message: [
		'Nie rozumiem. Napisz jeszcze raz.',
		'Nie mogę rozpoznać słów kluczowych w twojej wiadomości. Spróbuj ponownie.',
		'Nie mogę odpowiedzieć na twoją wiadomość, brakuje w niej informacji.'
	]
};

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
	if (user_message.value === '') return;
	send_message('user', user_message.value);
	stored_user_message = user_message.value;
	user_message.value = '';
	setTimeout(function() {
		get_ai_response();
	}, 1000);
}

user_message.addEventListener('keypress', (e) => {
	if (e.key === 'Enter')
	{
		send_user_message();
	}
})

function fuse_get_best_match(input, keywords)
{
	const fuse = new Fuse(keywords, {
		includeScore: true,
		threshold: 0.5, // how strict is the search, 0.0 - exact matches, 1.0 - loose matches
		distance: 100,
		keys: ['word']
	});

	const tokens = input.toLowerCase().split(/\s+/);
	var best_match = null;

	for (var token of tokens)
	{
		const results = fuse.search(token);
		if (results.length > 0 && (best_match === null || results[0].score < best_match.score))
		{
			best_match = results[0];
		}
	}

	return best_match;
}

const fuse_keywords = {
	greet: keywords.greet.map(word => ({ word })),
	farewell: keywords.farewell.map(word => ({ word })),
	status: keywords.status.map(word => ({ word })),
	fun: keywords.fun.map(word => ({ word }))
};

function get_ai_response()
{
	var match = fuse_get_best_match(stored_user_message, fuse_keywords.greet);
	if (match && match.score < 0.3)
	{
		send_message('ai', ai_responses.greet[random_int(0, ai_responses.greet.length - 1)]);
		return;
	}

	match = fuse_get_best_match(stored_user_message, fuse_keywords.farewell);
	if (match && match.score < 0.3)
	{
		send_message('ai', ai_responses.farewell[random_int(0, ai_responses.farewell.length - 1)]);
		return;
	}

	match = fuse_get_best_match(stored_user_message, fuse_keywords.status);
	if (match && match.score < 0.3)
	{
		if (match['item']['word'] === 'status')
		{
			send_message('ai', ai_responses.status[random_int(0, 1)]);
			return;
		}
		else if (match['item']['word'] === 'alarm')
		{
			send_message('ai', ai_responses.status[2]);
			return;
		}
	}

	match = fuse_get_best_match(stored_user_message, fuse_keywords.fun);
	if (match && match.score < 0.3)
	{
		send_message('ai', ai_responses.fun[random_int(0, ai_responses.fun.length - 1)]);
		return;
	}

	send_message('ai', ai_responses.unrecognizable_message[random_int(0, ai_responses.unrecognizable_message.length - 1)]);
}
