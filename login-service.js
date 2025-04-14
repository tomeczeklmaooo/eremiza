// safe asf
const demo_username = 'demo';
const demo_password = 'kochamszymka';

function login_manager()
{
	let username = document.getElementById('login-input-text-username').value;
	let password = document.getElementById('login-input-text-password').value;

	if (username === demo_username && password === demo_password)
	{
		window.location.href = 'admin-panel.html';
	}
	else
	{
		document.querySelector('.invalid-login-credentials-alert').style.opacity = 1.0;
	}
}