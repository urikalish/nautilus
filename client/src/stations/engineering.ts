import { Game } from '../model/game';
import { StationType } from '../model/station-type';
import { Station } from '../model/station';
import { Command, CommandShortText, CommandType } from '../model/command';
import { Speech } from '../services/speech';

export class Engineering implements Station {
	type: StationType = StationType.ENGINEERING;
	game: Game;

	constructor(game: Game) {
		this.game = game;
	}

	async tick() {}

	parseCommand(shortText: string): Command | null {
		if (shortText === CommandShortText.ENGINEERING_REPORT) {
			return new Command(CommandShortText.ENGINEERING_REPORT, this.type, CommandType.ENGINEERING_REPORT, null, 'Engineering, report');
		}
		return null;
	}

	async executeCommand(command: Command) {
		if (command.shortText === CommandShortText.ENGINEERING_REPORT) {
			const speed = this.game.getMySub().speed;
			await Speech.stationSpeak(`Conn Engineering, speed ${speed} knots`, this.type);
		}
	}
}
