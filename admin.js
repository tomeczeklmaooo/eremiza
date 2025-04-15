/*
Nazwa remizy
Adres remizy
Dane kontaktowe
Lokalizacja na mapie (losowana z pliku CSV i pokazywana na mapie OpenStreetMap z Leaflet)
Liczba strażaków (losowane, zakres zależny od rodzaju; OSP: 10-20; PSP: 40-60)
Liczba wozów (losowane, zakres zależny od rodzaju; OSP: 1-2; PSP: 3-6)
Harmonogram dyżurów
Status remizy
*/
let firedept_mgr = `
<div class="admin-settings-inner-container">
	<h3>Zarządzaj remizą</h3>
	<div class="admin-input-group">
		<span>Nazwa remizy</span>
		<input type="text" id="admin-input-text-unit-name" class="admin-input-text">
	</div>
	<div class="admin-input-group">
		<span>Adres remizy</span>
		<input type="text" id="admin-input-text-unit-address" class="admin-input-text">
	</div>
	<div class="admin-input-group">
		<span>Dane kontaktowe</span>
		<input type="text" id="admin-input-text-unit-contact-name" class="admin-input-text" placeholder="Imię i nazwisko">
		<input type="text" id="admin-input-text-unit-contact-phone" class="admin-input-text" placeholder="Nr. telefonu">
		<input type="text" id="admin-input-text-unit-contact-mail" class="admin-input-text" placeholder="Adres e-mail">
	</div>
	<div class="admin-input-group">
		<span>Lokalizacja na mapie</span>
		<div class="placeholder-map" style="background-color: blue;width: 150px;height: 150px;"></div>
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
		<span>UNIT_STATUS_ICON UNIT_STATUS_TEXT</span>
	</div>
</div>
`;

/*
Lista strażaków (imię, nazwisko, stopień, specjalizacja)
Dodaj/usuń strażaka
Historia udziału w akcjach
*/
let firemen_mgr = `
<div class="admin-settings-inner-container">
	<h3>Zarządzaj strażakami</h3>
	<div class="admin-input-group">
		<span>Lista strażaków</span>
		<span>TABLE_HERE</span>
	</div>
	<div class="admin-input-group">
		<button class="admin-input-btn">Dodaj strażaka</button>
		<button class="admin-input-btn">Usuń strażaka</button>
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
<div class="admin-settings-inner-container">
	<h3>Zarządzaj wozami</h3>
	<div class="admin-input-group">
		<span>Lista wozów</span>
		<span>TABLE_HERE</span>
	</div>
	<div class="admin-input-group">
		<button class="admin-input-btn">Dodaj wóz</button>
		<button class="admin-input-btn">Usuń wóz</button>
	</div>
</div>
`;

/*
Lista zgłoszeń (data + godzina, lokalizacja, typ, jednostki, status akcji)
Filtrowanie akcji
*/
let last_alarms = `
<div class="admin-settings-inner-container">
	<h3>Ostatnie alarmy</h3>
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
	var settings_display = document.querySelector('.admin-settings-display');
	switch(idx)
	{
		case 0:
			settings_display.innerHTML = firedept_mgr;
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