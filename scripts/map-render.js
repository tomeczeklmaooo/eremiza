const map = L.map('osm-map').setView([52.1, 19.4], 7);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
	attribution: '&copy; OpenStreetMap'
}).addTo(map);

const markers = L.markerClusterGroup();
map.addLayer(markers);

function load_units(url, color, label)
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
					// const lat = parseFloat(lat_str.replace(',', '.'));
					const lon = parseFloat(lon_str);
					// const lon = parseFloat(lon_str.replace(',', '.'));

					if (!isNaN(lat) && !isNaN(lon))
					{
						const icon = L.icon({
							iconUrl: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
								<svg xmlns="http://www.w3.org/2000/svg" width="36" height="36">
									<circle cx="18" cy="18" r="15" fill="${color}" stroke="white" stroke-width="1"/>
								</svg>
							`)}`,
							iconSize: [12, 12],
							iconAnchor: [6, 6]
						});
						const marker = L.marker([lat, lon], { icon });
	
						marker.bindPopup(`<strong>${unit['Nazwa']}</strong><br/>Typ: ${label}<br/>Miejscowość: ${unit['Miejscowość']}`);
						markers.addLayer(marker);
					}
				}
			});
		}
	});
}

load_units('data/osp.csv', 'red', 'OSP');
load_units('data/psp.csv', 'blue', 'PSP');

function calculate_distance(lat1, lon1, lat2, lon2)
{
	const R = 6371;
	const d_lat = (lat2 - lat1) * Math.PI / 180;
	const d_lon = (lon2 - lon1) * Math.PI / 180;
	const a = Math.sin(d_lat / 2) * Math.sin(d_lat / 2) + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(d_lon / 2) * Math.sin(d_lon / 2);
	const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
	return R * c;
}

function search_fire_depts()
{
	document.getElementById('found-depts').innerHTML = ``;
	const address = document.getElementById('find-input-text').value;
	if (address)
	{
		fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${address}`).then(response => response.json()).then(data => {
			if (data && data[0])
			{
				const user_lat = parseFloat(data[0].lat);
				const user_lon = parseFloat(data[0].lon);
				map.setView([user_lat, user_lon], 12);

				const distances = [];
				markers.eachLayer(function(marker)
				{
					const marker_lat = marker.getLatLng().lat;
					const marker_lon = marker.getLatLng().lng;
					const distance = calculate_distance(user_lat, user_lon, marker_lat, marker_lon);
					distances.push({ marker, distance });
				});

				distances.sort((a, b) => a.distance - b.distance);
				const closest_markers = distances.slice(0, 5);

				closest_markers.forEach((item, index) => {
					item.marker.openPopup();
					document.getElementById('found-depts').innerHTML += `${item.marker._popup.getContent()} - Odległość: ${item.distance.toFixed(2)} km<br>`;
				});
			}
		});
	}
}