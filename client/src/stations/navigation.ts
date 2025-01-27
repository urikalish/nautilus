import { Speech } from '../services/speech';
import { Game } from '../model/game';
import { StationType } from '../model/station-type';
import { Station } from '../model/station';
import { Command } from '../model/command';
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

	async report() {
		const sub = this.game.getMySub();
		const position = sub.position;
		console.log(`position: ${position}`);
		const sector = position.sector;
		this.lastReportedSector = sector;
		this.onAddReportAction(
			new Report(
				this.type,
				ReportType.REPORT_SECTOR,
				`Conn Navigation, current sector, ${Speech.toNatoPhonetic(sector[0])} ${Speech.toNatoPhonetic(sector[1])}`,
				`Very well`,
			),
		);
	}

	async tick() {
		const sub = this.game.getMySub();
		const position = sub.position;
		const newTime = Date.now();
		const dTime = newTime - position.time;
		const dDistance = (sub.speed / 3600000) * dTime;
		const angleRad = ((sub.course - 90) * Math.PI) / 180;
		const newX = roundDecimal(position.x + dDistance * Math.cos(angleRad), 3);
		const newY = roundDecimal(position.y - dDistance * Math.sin(angleRad), 3);
		position.setPosition(newTime, newX, newY);
		const newPosition = sub.position;
		const newSector = newPosition.sector;
		if (newSector !== this.lastReportedSector) {
			await this.report();
		}
	}

	parseCommand(shortText: string): Command | null {
		return null;
	}

	async executeCommand(command: Command) {}

	static calcDistance(x1: number, y1: number, x2: number, y2: number): number {
		return Math.sqrt((x1 - x2) ** 2 + (y1 - y2) ** 2);
	}

	static calcAngle(x1: number, y1: number, x2: number, y2: number): number {
		return ((Math.atan2(x2 - x1, y2 - y1) * 180) / Math.PI + 360) % 360;
	}

	static calcBearing(x1: number, y1: number, x2: number, y2: number, ownCourse: number): number {
		return (Navigation.calcAngle(x1, y1, x2, y2) - ownCourse + 360) % 360;
	}
}
