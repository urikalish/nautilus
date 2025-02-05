import { Game } from '../model/game';
import { StationType } from '../model/station-type';
import { Station } from '../model/station';
import { Command, CommandShortText, CommandType } from '../model/command';
import { Speech } from '../services/speech';
import { Report } from '../model/report';

export class Maneuvering implements Station {
	type: StationType = StationType.MANEUVERING;
	game: Game;
	onAddReportAction: (report: Report) => void;

	constructor(game: Game, onAddReportAction: (report: Report) => void) {
		this.game = game;
		this.onAddReportAction = onAddReportAction;
	}

	async tick() {}

	parseCommand(shortText: string): Command | null {
		if (shortText === CommandShortText.MANEUVERING_REPORT) {
			return new Command(CommandShortText.MANEUVERING_REPORT, this.type, CommandType.MANEUVERING_REPORT, null, 'Maneuvering, report');
		}
		return null;
	}

	async executeCommand(command: Command) {
		if (command.shortText === CommandShortText.MANEUVERING_REPORT) {
			const speed = this.game.getMySub().speed;
			await Speech.stationSpeak(`Conn maneuvering, speed ${speed} knots`, this.type);
		}
	}
}
