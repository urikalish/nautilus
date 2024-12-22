import { Sound } from './services/sound';
import { Position } from './model/position';
import { Speech } from './services/speech';
import { settings } from './model/settings';
import { Game } from './model/game';
import { getRandomNumber } from './services/utils';
import { Player } from './model/player';
import { Sub } from './model/sub';
import { Navigation } from './services/navigation';

let players: Player[];
let game: Game;
let ind: number;
let navigation: Navigation;

function start() {
	Sound.playEnvironmentSounds();
	ind = 0;
	players = [new Player(0), new Player(1)];
	const startDate: Date = new Date();
	const startTime = startDate.getTime();
	const subs = [
		new Sub(0, new Position(startTime, 1, 1), 45, settings.subSpeedFull, settings.subDepthTestFeet),
		new Sub(1, new Position(startTime, 7, 7), 125, settings.subSpeedFull, settings.subDepthTestFeet),
	];
	game = new Game(getRandomNumber(3), startDate, ind, players, subs);
	navigation = new Navigation(game);
	navigation.start();
}

function init() {
	document.title = settings.appName;
	Speech.init();
	document.getElementById('button-start')?.addEventListener('click', start);
}

init();
