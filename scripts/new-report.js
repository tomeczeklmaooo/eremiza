function send_report()
{
	const inp_location_address = document.querySelector('#report-input-text-location-address').value;
	const inp_location_post = document.querySelector('#report-input-text-location-post').value;
	const inp_location_city = document.querySelector('#report-input-text-location-city').value;
	const inp_location_phone = document.querySelector('#report-input-text-location-phone').value;
	const inp_type = document.querySelector('#report-input-select-type').value;
	const inp_description = document.querySelector('#report-input-textarea-description').value;

	const post_regex = /^[0-9]{2}-[0-9]{3}$/.test(inp_location_post);

	if (!post_regex)
	{
		modal_handler('Kod pocztowy w złym formacie! Użyj formatu XY-ABC.');
		return;
	}

	// also add to what unit it was reported to (from CSV)
	let message = `
	<strong>Wysłano zgłoszenie!</strong><br>
	Lokalizacja: ${inp_location_address}, ${inp_location_post} ${inp_location_city}<br>
	Numer kontaktowy: ${inp_location_phone}<br>
	Rodzaj zgłoszenia: ${inp_type}<br>
	Opis: ${inp_description}
	`;

	modal_handler(message);
}

// modal stuff
function modal_handler(text)
{
	const modal = document.querySelector('#modal');
	const close = document.querySelector('.close');
	const modal_content = document.querySelector('#modal-text');

	modal_content.innerHTML = text;

	modal.style.display = 'block';
	close.onclick = function() { modal.style.display = 'none'; }
	window.onclick = function(event) { if (event.target == modal) modal.style.display = 'none'; }
}