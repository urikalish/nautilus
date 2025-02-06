import { Game } from './model/game';
import { Player } from './model/player';
import { Sub } from './model/sub';
import { Position } from './model/position';
import { settings } from './model/settings';
import { calcDistance, getRandomNumber } from './services/utils';
import { Speech } from './services/speech';
import { GameManager } from './game-manager';
import { hideElement, showElement } from './services/ui-helper';
import { EngineState } from './model/engine-state';

export class Initializer {
	async start() {
		const players = [new Player(0), new Player(1)];
		const startDate: Date = new Date();
		const startTime = startDate.getTime();
		let p: number[];
		let d = 0;
		do {
			p = [Math.random() * 6 + 1, Math.random() * 6 + 1, Math.random() * 6 + 1, Math.random() * 6 + 1];
			d = calcDistance(p[0], p[1], p[2], p[3]);
		} while (d < 7);

		const subs = [
			new Sub(0, new Position(startTime, p[0], p[1]), Math.trunc(Math.random() * 360), EngineState.TWO_THIRDS, settings.speed.twoThirds, 900),
			new Sub(1, new Position(startTime, p[2], p[3]), Math.trunc(Math.random() * 360), EngineState.TWO_THIRDS, settings.speed.twoThirds, 900),
		];
		const ind = 0;
		const game = new Game(getRandomNumber(3), startDate, ind, players, subs);
		const gameManager = new GameManager(game);
		await gameManager.start();
	}

	init() {
		document.title = settings.appName;
		Speech.init();
		const btnStart = document.getElementById('btn-start');
		btnStart!.addEventListener('click', async () => {
			hideElement(btnStart);
			await this.start();
			setTimeout(() => {
				const wrapperElm = document.getElementById('wrapper');
				showElement(wrapperElm);
			}, 2000);
		});
	}
}
