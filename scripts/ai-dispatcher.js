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
		'alarm'
	],
	// FUN KEYWORDS
	fun: [
		'meow'
	],
	// HELP KEYWORDS
	help: [
		'pomoc'
	],
	// ABILITIES KEYWORDS
	abilities: [
		'robić', // co potrafisz robić
		'zrobić', // co potrafisz zrobić
		'potrafisz', // co potrafisz robić/zrobić
		'umiesz' // co umiesz robić/zrobić
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
	// HELP RESPONSES
	help: [
		'Żeby zobaczyć status danej jednostki, wpisz <b>status MIEJSCOWOŚĆ</b> (zastąp MIEJSCOWOŚĆ faktyczną nazwą, np. Poznań).<br>Żeby zobaczyć ostatnie 5 alarmów danej jednostki, komenda wygląda analogicznie do statusu, tylko zastąp słowo kluczowe <b>status</b> słowem <b>alarm</b>'
	],
	// ABILITIES RESPONSES
	abilities: [
		'Potrafię pokazać status wybranej jednostki, ostatni alarm wybranej jednostki, i to by było na tyle.'
	],
	// UNRECOGNIZABLE_USER_MESSAGE MESSAGES
	unrecognizable_message: [
		'Nie rozumiem. Napisz jeszcze raz.',
		'Nie mogę rozpoznać słów kluczowych w twojej wiadomości. Spróbuj ponownie.',
		'Nie mogę odpowiedzieć na twoją wiadomość, brakuje w niej informacji.'
	]
};

load_all_units([
	{ url: 'data/osp.csv', label: 'OSP' },
	{ url: 'data/psp.csv', label: 'PSP' }
], function() { ; });

function parse_user_message(input)
{
	// quotes
	input = input.trim().toLowerCase();
	const match = input.match(/^(status|alarm)\s+"(.+)"$/);

	if (match) return { type: match[1], location: match[2] };

	// spaces
	const words = input.split(/\s+/);
	const keyword = words[0];
	const location = words.slice(1).join(' ');

	if (keyword === 'status') return { type: 'status', location: location };
	else if (keyword === 'alarm') return { type: 'alarm', location: location };
	else return { type: 'unknown', location: null };
}

const unit_status = [
	'Oczekiwanie',
	'Wyjazd na akcję',
	'Wycofanie z akcji',
	'Powrót do remizy',
	'Niedostępna'
];

function get_random_unit_status()
{
	return unit_status[random_int(0, unit_status.length - 1)];
}

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
	if (type === 'ai')
	{
		message_div.innerHTML = `<strong><img src="images/eremiza-logo-small.png" alt="icon">&nbsp;${sender}</strong>&emsp;<span class="timestamp">${timestamp}</span><br>${message}`;
	}
	else
	{
		message_div.innerHTML = `<strong>${sender}</strong>&emsp;<span class="timestamp">${timestamp}</span><br>${message}`;
	}
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

const fuse_match_threshold = 0.4; // how strict is the search, 0.0 - exact matches, 1.0 - loose matches
const fuse_match_distance = 50;

function fuse_get_best_match(input, keywords)
{
	const fuse = new Fuse(keywords, {
		includeScore: true,
		threshold: fuse_match_threshold,
		distance: fuse_match_distance,
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
	fun: keywords.fun.map(word => ({ word })),
	help: keywords.help.map(word => ({ word })),
	abilities: keywords.abilities.map(word => ({ word }))
};

function get_ai_response()
{
	var match = fuse_get_best_match(stored_user_message, fuse_keywords.greet);
	if (match && match.score < fuse_match_threshold)
	{
		send_message('ai', ai_responses.greet[random_int(0, ai_responses.greet.length - 1)]);
		return;
	}

	match = fuse_get_best_match(stored_user_message, fuse_keywords.farewell);
	if (match && match.score < fuse_match_threshold)
	{
		send_message('ai', ai_responses.farewell[random_int(0, ai_responses.farewell.length - 1)]);
		return;
	}

	match = fuse_get_best_match(stored_user_message, fuse_keywords.status);
	if (match && match.score < fuse_match_threshold)
	{
		const parsed_user_message = parse_user_message(stored_user_message);
		let all_units_in_city = [];
		let all_units_statuses = '';
		let all_units_alarms = '';

		for (var i = 0; i < units_list.length; i++)
		{
			if (parsed_user_message.location.trim().toLowerCase() === units_list[i].city.toLowerCase()) all_units_in_city.push(units_list[i].name);
		}

		for (var i = 0; i < units_list.length; i++)
		{
			if (parsed_user_message.location.toLowerCase() === units_list[i].city.toLowerCase())
			{
				if (match['item']['word'] === 'status' && parsed_user_message.type === 'status')
				{
					for (var j = 0; j < all_units_in_city.length; j++)
					{
						all_units_statuses += `Status jednostki ${all_units_in_city[j]}: ${get_random_unit_status()}<br>`;
					}
					send_message('ai', all_units_statuses);
					all_units_statuses = '';
					return;
				}
				else if (match['item']['word'] === 'alarm' && parsed_user_message.type === 'alarm')
				{
					for (var j = 0; j < all_units_in_city.length; j++)
					{
						all_units_alarms += `Ostatni alarm dla jednostki ${all_units_in_city[j]}: day/month/year hour:minute<br>`;
					}
					send_message('ai', all_units_alarms);
					all_units_alarms = '';
					return;
				}
			}
		}
	}

	match = fuse_get_best_match(stored_user_message, fuse_keywords.fun);
	if (match && match.score < fuse_match_threshold)
	{
		send_message('ai', ai_responses.fun[random_int(0, ai_responses.fun.length - 1)]);
		return;
	}

	match = fuse_get_best_match(stored_user_message, fuse_keywords.help);
	if (match && match.score < fuse_match_threshold)
	{
		send_message('ai', ai_responses.help[random_int(0, ai_responses.help.length - 1)]);
		return;
	}

	match = fuse_get_best_match(stored_user_message, fuse_keywords.abilities);
	if (match && match.score < fuse_match_threshold)
	{
		send_message('ai', ai_responses.abilities[random_int(0, ai_responses.abilities.length - 1)]);
		return;
	}

	send_message('ai', ai_responses.unrecognizable_message[random_int(0, ai_responses.unrecognizable_message.length - 1)]);
}
