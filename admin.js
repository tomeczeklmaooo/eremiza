var firedept_mgr = `Zarządzaj remizą`;
var firemen_mgr = `Zarządzaj strażakami`;
var firecar_mgr = `Zarządzaj wozami`;
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