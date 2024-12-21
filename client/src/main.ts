import { Sound } from './sound';
import { Position } from './position';

let a = 3;

let position = new Position(4, 4);

function start() {
	Sound.playEnvironmentSounds();
	position = new Position(4, 4);
	setInterval(() => {
		position.updatePosition(25, 45);
		console.log(position);
	}, 10000);
}

function init() {
	const buttonStart = document.getElementById('button-start');
	if (buttonStart) {
		buttonStart.addEventListener('click', start);
	}
}

init();
