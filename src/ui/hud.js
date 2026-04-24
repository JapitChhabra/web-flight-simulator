export class HUD {
	constructor() {
		this.speedElem = document.getElementById('speed');
		this.altElem = document.getElementById('altitude');
		this.fpsElem = document.getElementById('fps');
		this.coordsElem = document.getElementById('coords');
		this.headingDisplay = document.getElementById('heading-display');
		this.compassTape = document.getElementById('compass-tape');
		this.pullUpElem = document.getElementById('pull-up-warning');

		this.showHorizonLines = false;
		this.startTime = Date.now();
		this.lastHeading = 0;

		this.createCompass();
	}

	resetTime() {
		this.startTime = Date.now();
	}

	setMinimapRange(_range) {
		// Kept as a no-op for compatibility with existing settings flow.
	}

	setShowHorizonLines(show) {
		// Kept for compatibility; horizon rendering was removed from MVP HUD.
		this.showHorizonLines = !!show;
	}

	setPullUpWarning(shouldShow) {
		if (!this.pullUpElem) return;
		if (shouldShow) this.pullUpElem.classList.remove('hidden');
		else this.pullUpElem.classList.add('hidden');
	}

	updateFPS(fps) {
		if (this.fpsElem) this.fpsElem.textContent = `${Math.round(fps)}`;
	}

	createCompass() {
		if (!this.compassTape) return;

		const step = 5;
		const pixelsPerDegree = 4;
		this.compassTape.innerHTML = '';

		for (let i = -360; i <= 720; i += step) {
			const tick = document.createElement('div');
			tick.className = 'compass-tick';
			tick.style.left = `${(i + 360) * pixelsPerDegree}px`;
			tick.style.height = i % 10 === 0 ? '10px' : '5px';
			this.compassTape.appendChild(tick);

			if (i % 10 !== 0) continue;

			const label = document.createElement('div');
			label.className = 'compass-label';
			label.style.left = `${(i + 360) * pixelsPerDegree}px`;

			let degree = i % 360;
			if (degree < 0) degree += 360;

			let text = Math.round(degree).toString().padStart(3, '0');
			if (degree === 0) text = 'N';
			else if (degree === 90) text = 'E';
			else if (degree === 180) text = 'S';
			else if (degree === 270) text = 'W';

			label.textContent = text;
			this.compassTape.appendChild(label);
		}
	}

	update(state) {
		const speed = Math.max(0, Math.round(state.speed || 0));
		const altFeet = Math.max(0, Math.round((state.alt || 0) * 3.28084));

		if (this.speedElem) this.speedElem.textContent = speed.toString().padStart(3, '0');
		if (this.altElem) this.altElem.textContent = altFeet.toString().padStart(5, '0');

		if (this.coordsElem) {
			const lat = state.lat || 0;
			const lon = state.lon || 0;
			const latDir = lat >= 0 ? 'N' : 'S';
			const lonDir = lon >= 0 ? 'E' : 'W';
			this.coordsElem.textContent = `POS: ${Math.abs(lat).toFixed(4)}°${latDir} ${Math.abs(lon).toFixed(4)}°${lonDir}`;
		}

		let heading = state.heading || 0;
		while (heading < 0) heading += 360;
		while (heading >= 360) heading -= 360;
		this.lastHeading = heading;

		if (this.headingDisplay) {
			const rounded = Math.round(heading) % 360;
			this.headingDisplay.textContent = rounded.toString().padStart(3, '0');
		}

		if (this.compassTape) {
			const pixelsPerDegree = 4;
			const centerOffset = 160;
			const targetPosOnTape = (heading + 360) * pixelsPerDegree;
			const offset = centerOffset - targetPosOnTape;
			this.compassTape.style.transform = `translateX(${offset}px)`;
		}
	}
}
