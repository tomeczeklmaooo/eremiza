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
let firedept_mgr = `
<h3>Zarządzaj remizą</h3>
<div class="admin-settings-inner-container">
	<div class="admin-settings-inner-container-column">
		<div class="admin-input-group">
			<span>Nazwa remizy</span>
			<input type="text" id="admin-input-text-unit-name" class="input-text admin-input-text" placeholder="Nazwa remizy">
		</div>
		<div class="admin-input-group">
			<span>Adres remizy</span>
			<input type="text" id="admin-input-text-unit-address" class="input-text admin-input-text" placeholder="Adres remizy">
		</div>
		<div class="admin-input-group">
			<span>Dane kontaktowe</span>
			<input type="text" id="admin-input-text-unit-contact-name" class="input-text admin-input-text" placeholder="Imię i nazwisko">
			<input type="text" id="admin-input-text-unit-contact-phone" class="input-text admin-input-text" placeholder="Nr. telefonu">
			<input type="text" id="admin-input-text-unit-contact-mail" class="input-text admin-input-text" placeholder="Adres e-mail">
		</div>
		<div class="admin-input-group">
			<span>Liczba strażaków</span>
			<span>FIREMEN_COUNT</span>
		</div>
		<div class="admin-input-group">
			<span>Liczba wozów</span>
			<span>FIRECAR_COUNT</span>
		</div>
		<div class="admin-input-group">
			<span>Harmonogram dyżurów</span>
			<span>TABLE_HERE</span>
		</div>
		<div class="admin-input-group">
			<span>Status remizy</span>
			<span><span class="unit-status-active"><i class="fa-solid fa-circle-check"></i> Aktywna</span> / <span class="unit-status-inactive"><i class="fa-solid fa-circle-xmark"></i> Nieaktywna</span></span>
		</div>
	</div>
	<div class="admin-settings-inner-container-column">
		<div class="admin-input-group">
			<span>Lokalizacja na mapie</span>
			<div id="admin-unit-map"></div>
		</div>
	</div>
</div>
`;

let units_list = [];

let random_unit = random_int(0, units_list.length - 1);

let map_script = `
<script>
	const map = L.map('admin-unit-map').setView([50.00, 16.00], 15);

	const tiles = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
		maxZoom: 19,
		attribution: '&copy; OpenStreetMap'
	}).addTo(map);

	const marker = L.marker([50.00, 16.00]).addTo(map);
</script>`;

/*
Lista strażaków (imię, nazwisko, stopień, specjalizacja)
Dodaj/usuń strażaka
Historia udziału w akcjach
*/
let firemen_mgr = `
<h3>Zarządzaj strażakami</h3>
<div class="admin-settings-inner-container">
	<div class="admin-input-group">
		<span>Lista strażaków</span>
		<span>TABLE_HERE</span>
	</div>
	<div class="admin-input-group">
		<button class="input-btn"><i class="fa-solid fa-plus"></i> Dodaj strażaka</button>
		<button class="input-btn"><i class="fa-solid fa-minus"></i> Usuń strażaka</button>
	</div>
	<div class="admin-input-group">
		<span>Historia udziału w akcjach</span>
		<span>TABLE_HERE:FILTER_BY_NAME</span>
	</div>
</div>
`;

/*
Lista wozów (model, typ, numer operacyjny, stan (sprawny / w naprawie / wycofany), ostatni przegląd, kierowcy)
Dodaj/usuń pojazd
*/
let firecar_mgr = `
<h3>Zarządzaj wozami</h3>
<div class="admin-settings-inner-container">
	<div class="admin-input-group">
		<span>Lista wozów</span>
		<span>TABLE_HERE</span>
	</div>
	<div class="admin-input-group">
		<button class="input-btn"><i class="fa-solid fa-plus"></i> Dodaj wóz</button>
		<button class="input-btn"><i class="fa-solid fa-minus"></i> Usuń wóz</button>
	</div>
</div>
`;

/*
Lista zgłoszeń (data + godzina, lokalizacja, typ, jednostki, status akcji)
Filtrowanie akcji
*/
let last_alarms = `
<h3>Ostatnie alarmy</h3>
<div class="admin-settings-inner-container">
	<div class="admin-input-group">
		<span>Lista zgłoszeń</span>
		<span>TABLE_HERE</span>
	</div>
	<div class="admin-input-group">
		<span>Adres remizy</span>
		<span>FILTER_LIST:DATETIME/LOCATION/TYPE/UNITS/STATUS</span>
	</div>
</div>
`;

function change_display_content(idx)
{
	const settings_display = document.querySelector('.admin-settings-display');
	const admin_body = document.querySelector('body');
	switch(idx)
	{
		case 0:
			settings_display.innerHTML = firedept_mgr;
			admin_body.innerHTML += map_script;
			break;
		case 1:
			settings_display.innerHTML = firemen_mgr;
			break;
		case 2:
			settings_display.innerHTML = firecar_mgr;
			break;
		case 3:
			settings_display.innerHTML = last_alarms;
			break;
	}
}