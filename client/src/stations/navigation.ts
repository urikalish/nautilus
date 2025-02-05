import { Speech } from '../services/speech';
import { Game } from '../model/game';
import { StationType } from '../model/station-type';
import { Station } from '../model/station';
import { Command, CommandShortText, CommandType } from '../model/command';
import { roundDecimal } from '../services/utils';
import { Report, ReportType } from '../model/report';

export class Navigation implements Station {
	type: StationType = StationType.NAVIGATION;
	game: Game;
	onAddReportAction: (report: Report) => void;
	lastReportedSector: string = '';

	constructor(game: Game, onAddReportAction: (report: Report) => void) {
		this.game = game;
		this.onAddReportAction = onAddReportAction;
	}

	async tick() {
		const sub = this.game.getMySub();
		const position = sub.position;
		const newTime = Date.now();
		const dTime = newTime - position.time;
		const dDistance = (sub.speed / 3600000) * dTime;
		const angleRad = ((sub.course - 90) * Math.PI) / 180;
		const newX = roundDecimal(position.x + dDistance * Math.cos(angleRad), 6);
		const newY = roundDecimal(position.y - dDistance * Math.sin(angleRad), 6);
		position.setPosition(newTime, newX, newY);
		const newPosition = sub.position;
		const newSector = newPosition.sector;
		if (this.lastReportedSector !== '' && newSector !== this.lastReportedSector) {
			const sub = this.game.getMySub();
			const position = sub.position;
			const sector = position.sector;
			this.lastReportedSector = sector;
			const sectorPhonetics = `${Speech.toNatoPhonetic(sector[0])} ${Speech.toNatoPhonetic(sector[1])}`;
			this.onAddReportAction(
				new Report(this.type, ReportType.REPORT_SECTOR, `Conn Navigation, current sector, ${sectorPhonetics}`, `${sectorPhonetics}, aye`),
			);
		}
	}

	parseCommand(shortText: string): Command | null {
		if (shortText === CommandShortText.NAVIGATION_REPORT) {
			return new Command(CommandShortText.NAVIGATION_REPORT, this.type, CommandType.NAVIGATION_REPORT, null, 'Navigation, report');
		}
		return null;
	}

	async executeCommand(command: Command) {
		if (command.commandType === CommandType.NAVIGATION_REPORT) {
			const sub = this.game.getMySub();
			const position = sub.position;
			const sector = position.sector;
			this.lastReportedSector = sector;
			await Speech.stationSpeak(
				`Conn Navigation, current sector, ${Speech.toNatoPhonetic(sector[0])} ${Speech.toNatoPhonetic(sector[1])}`,
				this.type,
			);
		}
	}
}
