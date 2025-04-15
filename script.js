var image_id = 0;

function landing_banner_image_change()
{
	image_sources = [
		`url('images/1.jpg') #000000b2`,
		`url('images/2.jpg') #000000b2`,
		`url('images/3.jpg') #000000b2`,
		`url('images/4.jpg') #000000b2`
	];

	if (document.getElementsByTagName('landing-banner')[0])
	{
		var landing_banner = document.getElementsByTagName('landing-banner')[0];
		
		if (image_id >= image_sources.length) image_id = 0;
		landing_banner.style.background = image_sources[image_id++];
		landing_banner.style.backgroundSize = '100%';
		landing_banner.style.backgroundPosition = 'center';
		setTimeout(landing_banner_image_change, 10000); // 10 seconds
	}
	else
	{
		console.log('No landing-banner element found.');
	}
}

function check_browser()
{
	let body_content_initial = document.querySelector('body').innerHTML;

	if (document.querySelectorAll('meta[content="no-browser-alert"]').length > 0)
	{
		return;
	}
	else 
	{
		if (platform.name.toLowerCase() !== 'firefox')
		{
			document.querySelector('body').innerHTML = `<eremiza-browser-alert></eremiza-browser-alert>${body_content_initial}`;
			document.getElementById('browser-alert').innerHTML = `Strona działa lepiej w przeglądarce Mozilla Firefox (używasz ${platform.name} ${platform.version})`;
		}
		else
		{
			document.getElementById('browser-alert').style.display = 'none';
		}
	}
}

function random_int(min, max)
{
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

function lt10(n)
{
	if (n < 10) n = '0' + n;
	return n;
}

window.onload = function()
{
	check_browser();
	landing_banner_image_change();
}