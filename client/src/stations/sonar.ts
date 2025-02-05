import { Game } from '../model/game';
import { StationType } from '../model/station-type';
import { Station } from '../model/station';
import { Command, CommandShortText, CommandType } from '../model/command';
import { Speech } from '../services/speech';
import { Report } from '../model/report';
import { Contact } from '../model/contact';

export class Sonar implements Station {
	type: StationType = StationType.SONAR;
	game: Game;
	contacts: Contact[] = [];
	onAddReportAction: (report: Report) => void;

	constructor(game: Game, onAddReportAction: (report: Report) => void) {
		this.game = game;
		this.onAddReportAction = onAddReportAction;
	}

	async tick() {}

	parseCommand(shortText: string): Command | null {
		if (shortText === CommandShortText.SONAR_REPORT) {
			return new Command(CommandShortText.SONAR_REPORT, this.type, CommandType.SONAR_REPORT, null, 'Sonar, report');
		}
		return null;
	}

	async executeCommand(command: Command) {
		if (command.shortText === CommandShortText.SONAR_REPORT) {
			if (this.contacts.length) {
				await Speech.stationSpeak(`Conn Sonar, tracking ${this.contacts.length} contacts`, this.type);
			} else {
				await Speech.stationSpeak(`Conn Sonar, no contacts`, this.type);
			}
		}
	}
}
