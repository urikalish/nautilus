import { Sound } from './sound';

function start() {
	Sound.playEnvironmentSounds();
}

function init() {
	const buttonStart = document.getElementById('button-start');
	if (buttonStart) {
		buttonStart.addEventListener('click', start);
	}
}

init();
