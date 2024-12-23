import { Game } from './model/game';
import { Player } from './model/player';
import { Sub } from './model/sub';
import { Position } from './model/position';
import { settings } from './model/settings';
import { getRandomNumber } from './services/utils';
import { Speech } from './services/speech';
import { GameManager } from './game-manager';

export class Initializer {
	startButton: HTMLElement | null = document.getElementById('button-start');

	start() {
		const players = [new Player(0), new Player(1)];
		const startDate: Date = new Date();
		const startTime = startDate.getTime();
		const subs = [
			new Sub(0, new Position(startTime, 1.5, 1.5), 45, settings.speed.oneThird, settings.depth.test),
			new Sub(1, new Position(startTime, 6.5, 6.5), 225, settings.speed.oneThird, settings.depth.test),
		];
		const ind = 0;
		const game = new Game(getRandomNumber(3), startDate, ind, players, subs);
		const gameManager = new GameManager(game);
		gameManager.start();
	}

	init() {
		document.title = settings.appName;
		Speech.init();
		const startButton = document.getElementById('button-start');
		this.startButton!.addEventListener('click', () => {
			startButton!.classList.add('display--none');
			this.start();
		});
	}
}
