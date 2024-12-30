import { settings } from '../model/settings';
import { Speech } from '../services/speech';
import { Game } from '../model/game';
import { StationType } from '../model/station-type';
import { Station } from './station';
import { Command } from '../model/command';

export class Engineering implements Station {
	type: StationType = StationType.ENGINEERING;
	game: Game;
	lastReportedSpeed: number = -1;

	constructor(game: Game) {
		this.game = game;
	}

	speak(text: string, cb?: () => void) {
		Speech.speak(text, 0, 2.0, 1.5, 1.0, cb);
	}

	report() {
		const speed = this.game.getMySub().speed;
		this.lastReportedSpeed = speed;
		console.log(`speed: ${speed}`);
		const engineStatus: string = {
			[settings.speed.full]: 'full',
			[settings.speed.twoThirds]: 'two thirds',
			[settings.speed.oneThird]: 'one third',
			0: 'stopped',
		}[speed];
		this.speak(`Conn Engineering, engine ${engineStatus}, speed ${speed} knots`);
	}

	tick() {
		const speed = this.game.getMySub().speed;
		if (speed !== this.lastReportedSpeed) {
			this.report();
		}
	}

	parseCommand(shortText: string): Command | null {
		return null;
	}

	executeCommand(command: Command, cb?: () => void) {}
}
