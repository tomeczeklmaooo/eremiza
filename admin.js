/*
Nazwa remizy
Adres remizy
Dane kontaktowe
Lokalizacja na mapie (losowana z pliku CSV i pokazywana na mapie OpenStreetMap z Leaflet)
Liczba strażaków (losowane, zakres zależny od rodzaju; OSP: 10-20; PSP: 30-50)
Liczba wozów (losowane, zakres zależny od rodzaju; OSP: 1-2; PSP: 3-6)
Harmonogram dyżurów
Status remizy
*/
var firedept_mgr = `Zarządzaj remizą`;

/*
Lista strażaków (imię, nazwisko, stopień, specjalizacja)
Dodaj/usuń strażaka
Historia udziału w akcjach
*/
var firemen_mgr = `Zarządzaj strażakami`;

/*
Lista wozów (model, typ, numer operacyjny)
Stan techniczny (sprawny / w naprawie / wycofany)
Data ostatniego przeglądu
Kierowca główny + kierowca zastępczy
Dodaj/usuń pojazd
*/
var firecar_mgr = `Zarządzaj wozami`;

/*
Lista zgłoszeń (data + godzina, lokalizacja, typ, jednostki, status akcji)
Filtrowanie akcji
*/
var last_alarms = `Ostatnie alarmy`;

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