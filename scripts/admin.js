const firemen_limit_osp = 20;
const firemen_limit_psp = 60;
const firecar_limit_osp = 2;
const firecar_limit_psp = 6;

const alphabet_lower = 'abcdefghijklmnopqrstuwvxyz';
const alphabet_upper = alphabet_lower.toUpperCase();

let random_unit;
let firemen_count = 0;
let firecar_count = 0;
let fireman_index = 0;
let firecar_index = 0;

const firecar_model = [
	'MAN',
	'Scania',
	'Mercedes-Benz',
	'Iveco',
	'Volvo',
	'STAR',
	'Jelcz',
	'Żuk',
	'Tatra',
];

const firecar_types = [
	'GBA',
	'GCBA',
	'Pr',
	'Sn',
	'SD',
	'SRd',
	'SRt',
	'Inny'
];

const firecar_state = [
	'Sprawny',
	'W naprawie',
	'Wycofany'
];

const firemen_rank = [
	'Strażak',
	'Starszy strażak',
	'Dowódca roty',
	'Pomocnik sekcji',
	'Dowódca sekcji',
	'Pomocnik dowódcy plutonu',
	'Dowódca plutonu',
	'Członek komisji rewizyjnej',
	'Przewodniczący komisji rewizyjnej',
	'Członek zarządu',
	'Zastępca naczelnika',
	'Wiceprezes naczelnik',
	'Prezes',
];

const firemen_specialization = [
	'Kierowca',
	'Mechanik',
	'Sanitariusz',
	'Łącznościowiec',
	'Naczelnik'
];

function get_random_unit()
{
	if (!random_unit && units_list.length > 0)
	{
		random_unit = units_list[random_int(0, units_list.length - 1)];
	}
	return random_unit;
}

load_all_units([
	{ url: 'data/osp.csv', label: 'OSP' },
	{ url: 'data/psp.csv', label: 'PSP' }
], function()
{
	random_unit = get_random_unit();
	assign_content();
});

function initialize_map(lat, lon, zoom)
{
	const map_container = document.querySelector('#admin-unit-map');

	if (map_container)
	{
		const map = L.map('admin-unit-map').setView([lat, lon], zoom);
	
		const tiles = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
			maxZoom: 19,
			attribution: '&copy; OpenStreetMap'
		}).addTo(map);

		const marker = L.marker([lat, lon]).addTo(map);
	}
}

/*
Nazwa remizy (z pliku CSV, autowpisywana do pola)
Adres remizy (z pliku CSV, autowpisywana do pola)
Dane kontaktowe (losowane)
Lokalizacja na mapie (losowana z pliku CSV i pokazywana na mapie OpenStreetMap z Leaflet)
Liczba strażaków (losowane, zakres zależny od rodzaju; OSP: 10-20; PSP: 40-60)
Liczba wozów (losowane, zakres zależny od rodzaju; OSP: 1-2; PSP: 3-6)
Harmonogram dyżurów
Status remizy
*/
let firedept_mgr;

/*
Lista strażaków (imię, nazwisko, stopień, specjalizacja)
Dodaj/usuń strażaka
Historia udziału w akcjach
*/
let firemen_mgr;

/*
Lista wozów (model, typ, numer operacyjny, stan (sprawny / w naprawie / wycofany), ostatni przegląd, kierowcy)
Dodaj/usuń pojazd
*/
let firecar_mgr;

/*
Lista zgłoszeń (data + godzina, lokalizacja, typ, jednostki, status akcji)
Filtrowanie akcji
*/
let last_alarms;

function assign_content()
{
	firemen_count = (random_unit.type == 'OSP') ? random_int(10, 20) : random_int(40, 60);
	firecar_count = (random_unit.type == 'OSP') ? random_int(1, 2) : random_int(3, 6);

	firedept_mgr = `
	<h3>Zarządzaj remizą</h3>
	<div class="admin-settings-inner-container">
		<div class="admin-settings-inner-container-column">
			<div class="admin-input-group">
				<span class="admin-input-header">Nazwa remizy</span>
				<input type="text" id="admin-input-text-unit-name" class="input-text admin-input-text" placeholder="Nazwa remizy" value="${random_unit.name}" readonly>
			</div>
			<div class="admin-input-group">
				<span class="admin-input-header">Adres remizy</span>
				<input type="text" id="admin-input-text-unit-address" class="input-text admin-input-text" placeholder="Adres remizy" value="${random_unit.address}" readonly>
			</div>
			<div class="admin-input-group">
				<span class="admin-input-header">Dane kontaktowe</span>
				<input type="text" id="admin-input-text-unit-contact-name" class="input-text admin-input-text" placeholder="Imię i nazwisko"  value="${chance.name()}" readonly>
				<input type="text" id="admin-input-text-unit-contact-phone" class="input-text admin-input-text" placeholder="Nr. telefonu" value="+48 ${chance.phone({formatted: false}).substring(0, 9)}" readonly>
				<input type="text" id="admin-input-text-unit-contact-mail" class="input-text admin-input-text" placeholder="Adres e-mail" value="${chance.email({domain: 'eremiza.pl'})}" readonly>
			</div>
			<div class="admin-input-group">
				<span class="admin-input-header">Liczba strażaków</span>
				<span>${firemen_count}</span>
			</div>
			<div class="admin-input-group">
				<span class="admin-input-header">Liczba wozów</span>
				<span>${firecar_count}</span>
			</div>
			<div class="admin-input-group">
				<span class="admin-input-header">Harmonogram dyżurów</span>
				<span>TABLE_HERE</span>
			</div>
			<div class="admin-input-group">
				<span class="admin-input-header">Status remizy</span>
				<span>${(random_int(0, 999999) <= 999000) ? `<span class="unit-status-active"><i class="fa-solid fa-circle-check"></i> Aktywna</span>` : `<span class="unit-status-inactive"><i class="fa-solid fa-circle-xmark"></i> Nieaktywna</span>`}</span>
			</div>
		</div>
		<div class="admin-settings-inner-container-column">
			<div class="admin-input-group">
				<span class="admin-input-header">Lokalizacja na mapie</span>
				<div id="admin-unit-map"></div>
			</div>
		</div>
	</div>
	`;

	firemen_mgr = `
	<h3>Zarządzaj strażakami</h3>
	<div class="admin-settings-inner-container">
		<div class="admin-settings-inner-container-column">
			<div class="admin-input-group">
				<span class="admin-input-header">Lista strażaków</span>
				<table id="firemen-table">
					<thead>
						<tr>
							<th>ID</th>
							<th>Imię i nazwisko</th>
							<th>Stopień</th>
							<th>Specjalizacja</th>
						</tr>
					</thead>
					<tbody id="firemen-list"></tbody>
				</table>
			</div>
			<div class="admin-input-group">
				<button class="input-btn" onclick="add_to_list('person', '${random_unit.type}')"><i class="fa-solid fa-plus"></i> Dodaj strażaka</button>
				<button class="input-btn" onclick="remove_from_list('person')"><i class="fa-solid fa-minus"></i> Usuń strażaka</button>
			</div>
			<div class="admin-input-group">
				<span style="user-select: none;">Dodawanie dodaje strażaka na koniec, a usuwanie usuwa ostatniego z listy.</span>
			</div>
		</div>
		<div class="admin-settings-inner-container-column">
			<div class="admin-input-group">
				<span class="admin-input-header">Historia udziału w akcjach</span>
				<span>TABLE_HERE:FILTER_BY_NAME</span>
			</div>
		</div>
	</div>
	`;

	firecar_mgr = `
	<h3>Zarządzaj wozami</h3>
	<div class="admin-settings-inner-container">
		<div class="admin-settings-inner-container-column">
			<div class="admin-input-group">
				<span class="admin-input-header">Lista wozów</span>
				<table id="firecar-table">
					<thead>
						<tr>
							<th>ID</th>
							<th>Model</th>
							<th>Typ</th>
							<th>Nr. operacyjny</th>
							<th>Stan</th>
							<th>Ostatni przegląd</th>
							<th>Kierowcy</th>
						</tr>
					</thead>
					<tbody id="firecar-list"></tbody>
				</table>
			</div>
			<div class="admin-input-group">
				<button class="input-btn" onclick="add_to_list('car', '${random_unit.type}')"><i class="fa-solid fa-plus"></i> Dodaj wóz</button>
				<button class="input-btn" onclick="remove_from_list('car')"><i class="fa-solid fa-minus"></i> Usuń wóz</button>
			</div>
			<div class="admin-input-group">
				<span style="user-select: none;">Dodawanie dodaje wóz na koniec, a usuwanie usuwa ostatni z listy.</span>
			</div>
		</div>
	</div>
	`;

	last_alarms = `
	<h3>Ostatnie alarmy</h3>
	<div class="admin-settings-inner-container">
		<div class="admin-settings-inner-container-column">
			<div class="admin-input-group">
				<span class="admin-input-header">Lista zgłoszeń</span>
				<span>TABLE_HERE</span>
			</div>
		</div>
		<div class="admin-settings-inner-container-column">
			<div class="admin-input-group">
				<span class="admin-input-header">Filtry</span>
				<span>FILTER_LIST:DATETIME/LOCATION/TYPE/UNITS/STATUS</span>
			</div>
		</div>
	</div>
	`;
}

function add_to_list(type, unit_type)
{
	let new_firecar = `
	<tr>
		<td>${firecar_index + 1}</td>
		<td>${firecar_model[random_int(0, firecar_model.length - 1)]}</td>
		<td>${firecar_types[random_int(0, firecar_types.length - 1)]}</td>
		<td>${random_int(100, 999)}[${alphabet_upper[random_int(0, alphabet_upper.length - 1)]}]${random_int(10, 99)}</td>
		<td>${firecar_state[random_int(0, firecar_state.length - 1)]}</td>
		<td>${get_random_time()}</td>
		<td>${chance.name()},<br>${chance.name()}</td>
	</tr>`;

	let new_fireman = `
	<tr>
		<td>${fireman_index + 1}</td>
		<td>${chance.name()}</td>
		<td>${firemen_rank[random_int(0, firemen_rank.length - 1)]}</td>
		<td>${firemen_specialization[random_int(0, firemen_specialization.length - 1)]}</td>
	</tr>`;

	if (type === 'car')
	{
		let rows = document.querySelector('#firecar-list').rows.length;
		if (unit_type === 'OSP')
		{
			if (rows != firecar_limit_osp)
			{
				document.getElementById('firecar-list').innerHTML += new_firecar;
			}
			if (firecar_index == firecar_limit_osp) firecar_index = firecar_limit_osp;
			else firecar_index++;
		}
		else if (unit_type === 'PSP')
		{
			if (rows != firecar_limit_psp)
			{
				document.getElementById('firecar-list').innerHTML += new_firecar;
			}
			if (firecar_index == firecar_limit_psp) firecar_index = firecar_limit_psp;
			else firecar_index++;
		}
	}
	else if (type === 'person')
	{
		let rows = document.querySelector('#firemen-list').rows.length;
		if (unit_type === 'OSP')
		{
			if (rows != firemen_limit_osp)
			{
				document.getElementById('firemen-list').innerHTML += new_fireman;
			}
			if (fireman_index == firemen_limit_osp) fireman_index = firemen_limit_osp;
			else fireman_index++;
		}
		else if (unit_type === 'PSP')
		{
			if (rows != firemen_limit_psp)
			{
				document.getElementById('firemen-list').innerHTML += new_fireman;
			}
			if (fireman_index == firemen_limit_psp) fireman_index = firemen_limit_psp;
			else fireman_index++;
		}
	}
}

function remove_from_list(type)
{
	if (type === 'car')
	{
		let rows = document.querySelector('#firecar-list').rows.length;
		document.getElementById('firecar-list').deleteRow(rows - 1)
		if (rows == 0) firecar_index = 0;
		else firecar_index--;
	}
	else if (type === 'person')
	{
		let rows = document.querySelector('#firemen-list').rows.length;
		document.getElementById('firemen-list').deleteRow(rows - 1)
		if (rows == 0) fireman_index = 0;
		else fireman_index--;
	}
}

function change_display_content(idx)
{
	const settings_display = document.querySelector('.admin-settings-display');
	switch(idx)
	{
		case 0:
			settings_display.innerHTML = firedept_mgr;
			setTimeout(() => {
				if (random_unit && random_unit.coordinates.lat && random_unit.coordinates.lon) initialize_map(random_unit.coordinates.lat, random_unit.coordinates.lon, 15);
			}, 0);
			break;
		case 1:
			settings_display.innerHTML = firemen_mgr;
			for (let i = 0; i < firemen_count; i++)
			{
				document.getElementById('firemen-list').innerHTML += `
				<tr>
					<td>${i + 1}</td>
					<td>${chance.name()}</td>
					<td>${firemen_rank[random_int(0, firemen_rank.length - 1)]}</td>
					<td>${firemen_specialization[random_int(0, firemen_specialization.length - 1)]}</td>
				</tr>`;
				fireman_index = i + 1;
			}
			break;
		case 2:
			settings_display.innerHTML = firecar_mgr;
			for (let i = 0; i < firecar_count; i++)
			{
				document.getElementById('firecar-list').innerHTML += `
				<tr>
					<td>${i + 1}</td>
					<td>${firecar_model[random_int(0, firecar_model.length - 1)]}</td>
					<td>${firecar_types[random_int(0, firecar_types.length - 1)]}</td>
					<td>${random_int(100, 999)}[${alphabet_upper[random_int(0, alphabet_upper.length - 1)]}]${random_int(10, 99)}</td>
					<td>${firecar_state[random_int(0, firecar_state.length - 1)]}</td>
					<td>${get_random_time()}</td>
					<td>${chance.name()},<br>${chance.name()}</td>
				</tr>`;
				firecar_index = i + 1;
			}
			break;
		case 3:
			settings_display.innerHTML = last_alarms;
			break;
	}
}

window.onload = function()
{
	const is_logged_in = sessionStorage.getItem('is_logged_in');
	if (is_logged_in !== 'true') window.location.href = 'login.html';
}