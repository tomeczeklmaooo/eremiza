var map_container = document.querySelector('.map-container');
var map_wrapper = document.querySelector('.map-wrapper');

var isDragging = false;
var startX, startY;
var translateX = 0, translateY = 0;
var scale = 1.4;

function update_transform()
{
	map_wrapper.style.transform = `translate(${translateX}px, ${translateY}px) scale(${scale})`;
}

function clamp(value, min, max)
{
	return Math.min(Math.max(value, min), max);
}

function get_bounds()
{
	const map_rect = map_wrapper.getBoundingClientRect();
	const container_rect = map_container.getBoundingClientRect();

	const scaled_width = map_wrapper.offsetWidth * scale;
	const scaled_height = map_wrapper.offsetHeight * scale;

	const minX = container_rect.width - scaled_width;
	const minY = container_rect.height - scaled_height;

	return {
		minX: Math.min(0, minX),
		minY: Math.min(0, minY),
		maxX: 0,
		maxY: 0
	};
}

map_wrapper.addEventListener('mousedown', (e) => {
	isDragging = true;
	startX = e.clientX - translateX;
	startY = e.clientY - translateY;
	map_wrapper.style.cursor = 'grabbing';
});

window.addEventListener('mousemove', (e) => {
	if (!isDragging) return;

	translateX = e.clientX - startX;
	translateY = e.clientY - startY;

	const { minX, minY, maxX, maxY } = get_bounds();
	translateX = clamp(translateX, minX, maxX);
	translateY = clamp(translateY, minY, maxY);

	update_transform();
});

window.addEventListener('mouseup', () => {
	isDragging = false;
	map_wrapper.style.cursor = 'grab';
});

map_container.addEventListener('wheel', (e) => {
	e.preventDefault();
	const zoom_level_change = 0.1;
	const mouseX = e.clientX - map_container.getBoundingClientRect().left;
	const mouseY = e.clientY - map_container.getBoundingClientRect().top;

	const scale_old = scale;
	scale += e.deltaY > 0 ? -zoom_level_change : zoom_level_change;
	scale = clamp(scale, 1.4, 15);

	translateX = mouseX - ((mouseX - translateX) / scale_old) * scale;
	translateY = mouseY - ((mouseY - translateY) / scale_old) * scale;

	const { minX, minY, maxX, maxY } = get_bounds();
	translateX = clamp(translateX, minX, maxX);
	translateY = clamp(translateY, minY, maxY);

	update_transform();
}, { passive: false });

update_transform();