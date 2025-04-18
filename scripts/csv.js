const units_list = [];

function load_units(url, label, callback)
{
	Papa.parse(url, {
		download: true,
		header: true,
		complete: function(results)
		{
			results.data.forEach(unit => {
				const lat_str = unit['y'];
				const lon_str = unit['x'];
				if (lat_str && lon_str)
				{
					const lat = parseFloat(lat_str);
					const lon = parseFloat(lon_str);

					if (!isNaN(lat) && !isNaN(lon))
					{
						units_list.push({
							type: label,
							name: unit['Nazwa'],
							city: unit['Miejscowość'],
							region: unit['Województwo'] || '',
							county: unit['Powiat'] || '',
							address: unit['Adres'] || '',
							coordinates: { lat: lat, lon: lon }
						});
					}
				}
			});
			
			if (typeof callback === 'function') callback();
		}
	});
}

let files_to_load = 0;
let files_loaded = 0;
let all_units_ready_callback = null;

function load_all_units(files, callback)
{
	files_to_load = files.length;
	files_loaded = 0;
	all_units_ready_callback = callback;

	files.forEach(unit => {
		load_units(unit.url, unit.label, on_file_loaded);
	});
}

function on_file_loaded()
{
	files_loaded++;
	if (files_loaded === files_to_load && typeof all_units_ready_callback === 'function') all_units_ready_callback();
}