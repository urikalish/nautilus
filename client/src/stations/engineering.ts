import { settings } from '../model/settings';
import { Speech } from '../services/speech';
import { Game } from '../model/game';
import { Station } from '../model/station';
import { Command } from '../model/command';

export class Engineering {
	station: Station = Station.ENGINEERING;
	game: Game;
	lastReportedSpeed: number = -1;

	constructor(game: Game) {
		this.game = game;
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

	getCommandText(command: Command) {
		alert(`Unknown ${this.station} command ${command.type}`);
	}

	// handleCommand(command: Command) {
	// 	alert('Engineering.handleCommand() not implemented');
	// }
}
