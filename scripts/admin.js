const firemen_limit_osp = 20;
const firemen_limit_psp = 60;
const firecar_limit_osp = 2;
const firecar_limit_psp = 6;

let random_unit;
let firemen_count = 0;
let firecar_count = 0;

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
				<input type="text" id="admin-input-text-unit-contact-phone" class="input-text admin-input-text" placeholder="Nr. telefonu" value="${chance.phone()}" readonly>
				<input type="text" id="admin-input-text-unit-contact-mail" class="input-text admin-input-text" placeholder="Adres e-mail" value="${chance.email()}" readonly>
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
				<table>
					<tbody id="firemen-list">
						<tr>
							<th>ID</th>
							<th>Imię i nazwisko</th>
							<th>Stopień</th>
							<th>Specjalizacja</th>
						</tr>
					</tbody>
				</table>
			</div>
			<div class="admin-input-group">
				<button class="input-btn"><i class="fa-solid fa-plus"></i> Dodaj strażaka</button>
				<button class="input-btn"><i class="fa-solid fa-minus"></i> Usuń strażaka</button>
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
				<table>
					<tbody id="firecar-list">
						<tr>
							<th>ID</th>
							<th>Model</th>
							<th>Typ</th>
							<th>Nr. operacyjny</th>
							<th>Stan</th>
							<th>Ostatni przegląd</th>
							<th>Kierowcy</th>
						</tr>
					</tbody>
				</table>
			</div>
			<div class="admin-input-group">
				<button class="input-btn"><i class="fa-solid fa-plus"></i> Dodaj wóz</button>
				<button class="input-btn"><i class="fa-solid fa-minus"></i> Usuń wóz</button>
			</div>
		</div>
		<div class="admin-settings-inner-container-column">
			<!-- EMPTY COLUMN -->
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
					<td>[stopień]</td>
					<td>[specjalizacja]</td>
				</tr>`;
			}
			break;
		case 2:
			settings_display.innerHTML = firecar_mgr;
			for (let i = 0; i < firecar_count; i++)
				{
					document.getElementById('firecar-list').innerHTML += `
					<tr>
						<td>${i + 1}</td>
						<td>[model]</td>
						<td>[typ]</td>
						<td>[nr. operacyjny]</td>
						<td>[stan]</td>
						<td>[ost. przegląd]</td>
						<td>[kierowcy]</td>
					</tr>`;
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