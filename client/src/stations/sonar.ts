import { Game } from '../model/game';
import { StationType } from '../model/station-type';
import { Station } from '../model/station';
import { Command, CommandShortText, CommandType } from '../model/command';
import { stationSpeak } from '../services/speech';
import { Report } from '../model/report';
import { Contact } from '../model/contact';
import { Sub } from '../model/sub';
import { settings } from '../model/settings';
import { ContactType } from '../model/contact-type';
import { calcBearing } from '../services/utils';

export class Sonar implements Station {
	type: StationType = StationType.SONAR;
	game: Game;
	onAddReportAction: (report: Report) => void;

	constructor(game: Game, onAddReportAction: (report: Report) => void) {
		this.game = game;
		this.onAddReportAction = onAddReportAction;
	}

	async tick() {
		const sub: Sub = this.game.getMySub();
		const waterfall = sub.waterfall;
		const contacts = sub.contacts;
		if (contacts.length === 0) {
			contacts.push(new Contact(ContactType.SUB, 'S1'));
		}
		const newRow: number[] = [];
		for (let c = 0; c < 360; c++) {
			newRow[c] = Math.random() * settings.sonar.waterfallNoiseMax;
			[89, 90, 91, 179, 180, 181, 269, 270, 271].forEach(p => {
				newRow[p] = settings.sonar.waterfallSection;
			});
		}
		contacts.forEach(c => {
			if (c.type === ContactType.SUB) {
				const enemy = this.game.getEnemySub();
				c.x = enemy.position.x;
				c.y = enemy.position.y;
				const bearing = calcBearing(sub.position.x, sub.position.y, enemy.position.x, enemy.position.y, sub.course);
				[-1, 0, 1].forEach(i => {
					newRow[(Math.round(bearing) + 180 + i) % 360] = 1;
				});
			}
		});
		waterfall.unshift(newRow);
		waterfall.length = settings.sonar.waterfallRows;
	}

	parseCommand(shortText: string): Command | null {
		if (shortText === CommandShortText.SONAR_REPORT) {
			return new Command(CommandShortText.SONAR_REPORT, this.type, CommandType.SONAR_REPORT, null, 'Sonar, report');
		}
		return null;
	}

	async executeCommand(command: Command) {
		const sub: Sub = this.game.getMySub();
		const contacts = sub.contacts;
		if (command.commandType === CommandType.SONAR_REPORT) {
			if (contacts.length) {
				await stationSpeak(`Conn Sonar, tracking ${contacts.length} contacts`, this.type);
			} else {
				await stationSpeak(`Conn Sonar, no contacts`, this.type);
			}
			return;
		}
	}
}
