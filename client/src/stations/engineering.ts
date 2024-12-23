import { settings } from '../model/settings';
import { Speech } from '../services/speech';
import { Game } from '../model/game';

export class Engineering {
	game: Game;
	lastReportedSpeed: number;

	constructor(game: Game) {
		this.game = game;
		this.lastReportedSpeed = -1;
	}

	speak(text: string, cb?: () => void) {
		Speech.speak(text, 0, 2.0, 1.5, 1.0, cb);
	}

	report(reportEngine: boolean, reportSpeed: boolean) {
		const speed = this.game.getMySub().speed;
		this.lastReportedSpeed = speed;
		console.log(`speed: ${speed}`);
		const engineStatus: string = {
			[settings.speed.full]: 'full',
			[settings.speed.twoThirds]: 'two thirds',
			[settings.speed.oneThird]: 'one third',
			0: 'stopped',
		}[speed];
		this.speak(`Conn Engineering ${reportEngine ? `, engine ${engineStatus}` : ``} ${reportSpeed ? `, speed ${speed} knots` : ``}`);
	}

	update() {
		const speed = this.game.getMySub().speed;
		if (speed !== this.lastReportedSpeed) {
			this.report(true, true);
		}
	}
}
