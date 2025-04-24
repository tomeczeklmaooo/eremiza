function random_date_in_range(start, end) {
	return new Date(Math.floor(Math.random() * (end - start + 1) + start));
}

function get_random_time()
{
	const date = new Date();
	const time = date.getTime();
	const time_past = date.getTime() - 30 * 24 * 60 * 60 * 1000;
	const random_date = random_date_in_range(time_past, time);

	let year = lt10(random_date.getFullYear());
	let month = lt10(random_date.getMonth() + 1);
	let day = lt10(random_date.getDate());
	let hour = lt10(random_date.getHours());
	let minute = lt10(random_date.getMinutes());
	let second = lt10(random_date.getSeconds());

	return `${day}/${month}/${year} ${hour}:${minute}:${second}`;
}