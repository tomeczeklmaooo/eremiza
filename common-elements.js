var current_year = new Date().getFullYear();

class eRemizaBrowserAlert extends HTMLElement {
	connectedCallback() {
		this.innerHTML = `
			<div id="browser-alert">
				Strona działa lepiej w przeglądarce Mozilla Firefox (używasz ${platform.name} ${platform.version})
			</div>
			`;
	}
}

class eRemizaHeader extends HTMLElement {
	connectedCallback() {
		this.innerHTML = `
			<header>
				<img src="images/eremiza-logo-large.png" alt="logo" height="70px" onclick="window.location.href = 'index.html'">
				<nav>
					<!--<nav-item class="btn btn-txt" onclick="window.location.href = 'interactive-map.html'">Interaktywna mapa</nav-item>-->
					<nav-item class="btn btn-txt" onclick="window.location.href = 'find-firedept.html'">Znajdź remizę</nav-item>
					<nav-item class="btn btn-txt" onclick="window.location.href = 'chat.html'">Czat z dyspozytorem AI</nav-item>
					<nav-item class="btn btn-txt" onclick="window.location.href = 'admin-panel.html'">Panel naczelnika OSP</nav-item>
					<nav-item class="btn btn-txt" onclick="window.location.href = 'about.html'">O nas</nav-item>
					<nav-item class="btn btn-txt" onclick="window.location.href = 'contact.html'">Kontakt</nav-item>
					<nav-item class="btn btn-cta" onclick="window.location.href = 'new-report.html'">Nowe zgłoszenie</nav-item>
				</nav>
			</header>
			`;
	}
}

class eRemizaFooter extends HTMLElement {
	connectedCallback() {
		this.innerHTML = `
			<footer>
				<div class="footer-box">
					<div class="footer-copyright">
						<img src="images/eremiza-logo-large.png" alt="logo" height="40px">
						<p>Copyright &copy; ${current_year} Tomasz Kamieniczny</p>
					</div>
					<div class="partner-sites">
						<h4>Polecane serwisy</h4>
						<p><span class="btn-nopad btn-txt">mKonfident</span> &ndash; companion-service do eRemiza</p>
					</div>
				</div>
				<div class="footer-box">
					<div class="eremiza-eu">
						<h4>eRemiza Extended Universe</h4>
						<p><span class="btn-nopad btn-txt">eRemiza Premium</span></p>
						<p><span class="btn-nopad btn-txt">Newsletter</span></p>
					</div>
				</div>
				<div class="footer-box">
					<div class="useful-links">
						<h4>Dla programistów</h4>
						<p><span class="btn-nopad btn-txt" onclick="window.location.href = '/api/response.json'">OpenRemizaAPI</span></p>
					</div>
				</div>
				<div class="footer-box">
					<div class="useful-links">
						<h4>Przydatne linki</h4>
						<p><span class="btn-nopad btn-txt" onclick="window.location.href = 'https:\/\/github.com\/tomeczeklmaooo\/eremiza'">Repozytorium GitHub</span></p>
						<p><span class="btn-nopad btn-txt">FAQ</span></p>
						<p><span class="btn-nopad btn-txt" onclick="window.location.href = 'open-source-licenses.html'">Licencje Open-Source</span></p>
					</div>
				</div>
			</footer>
			<!-- secondary footer żeby opisać coś więcej bez zmiany flexa w tym pierwszym -->
			<footer>
				<div class="footer-box">
					Wiem, że już istnieje takie coś jak e-remiza.pl, ale opinie na Google Play sugerują że to jest trochę tragiczny serwis i potrzebny jest jakiś lepszy.
				</div>
			</footer>
		`;
	}
}


customElements.define("eremiza-browser-alert", eRemizaBrowserAlert);
customElements.define("eremiza-header", eRemizaHeader);
customElements.define("eremiza-footer", eRemizaFooter);