var image_id = 0;

function landing_banner_image_change()
{
	image_sources = [
		`url('images/1.jpg') #000000b2`,
		`url('images/2.jpg') #000000b2`,
		`url('images/3.jpg') #000000b2`,
		`url('images/4.jpg') #000000b2`
	];
	
	if (image_id >= image_sources.length) image_id = 0;
	document.getElementsByTagName('landing-banner')[0].style.background = image_sources[image_id++];
	document.getElementsByTagName('landing-banner')[0].style.backgroundSize = '100%';
	document.getElementsByTagName('landing-banner')[0].style.backgroundPosition = 'center';
	setTimeout(landing_banner_image_change, 10000); // 10 seconds
}

window.onload = function()
{
	landing_banner_image_change();
}