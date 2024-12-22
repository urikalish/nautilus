import { settings } from '../model/settings';
import { Game } from '../model/game';
import { Speech } from './speech';

export class Engineering {
	game: Game;
	lastReportedSpeed: number = -1;

	constructor(game: Game) {
		this.game = game;
	}

	getMySub() {
		return this.game.subs[this.game.ind];
	}

	getMySpeed() {
		return this.getMySub().speed;
	}

	reportSpeed() {
		const speed = this.getMySpeed();
		this.lastReportedSpeed = speed;
		console.log(`speed: ${speed}`);
		const engineStatus: string = {
			[settings.speed.full]: 'full',
			[settings.speed.twoThirds]: 'two thirds',
			[settings.speed.oneThird]: 'one third',
			0: 'stopped',
		}[speed];
		Speech.speak(`Conn Engineering, engine ${engineStatus}, speed ${speed} knots`, 0, 2.0, 1.5, 1.0);
	}

	onTick() {
		const speed = this.getMySpeed();
		if (speed !== this.lastReportedSpeed) {
			this.reportSpeed();
		}
		setTimeout(this.onTick.bind(this), settings.reportInterval.engineering);
	}

	start() {
		setTimeout(this.onTick.bind(this), settings.reportInterval.engineering);
	}
}
