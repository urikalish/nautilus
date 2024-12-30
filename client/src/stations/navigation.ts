import { Speech } from '../services/speech';
import { Game } from '../model/game';
import { StationType } from '../model/station-type';
import { Station } from './station';
import { Command } from '../model/command';

export class Navigation implements Station {
	type: StationType = StationType.NAVIGATION;
	game: Game;
	lastReportedSector: string = '';

	constructor(game: Game) {
		this.game = game;
	}

	async speak(text: string) {
		await Speech.speak(text, { pitch: 2.0, rate: 1.5 });
	}

	async report() {
		const sub = this.game.getMySub();
		const position = sub.position;
		console.log(`position: ${position}`);
		const sector = position.sector;
		this.lastReportedSector = sector;
		await this.speak(`Conn Navigation, current sector, ${Speech.toNatoPhonetic(sector[0])} ${Speech.toNatoPhonetic(sector[1])}`);
	}

	async tick() {
		const sub = this.game.getMySub();
		const position = sub.position;
		const newTime = Date.now();
		const dTime = newTime - position.time;
		const dDistance = (sub.speed / 3600000) * dTime;
		const angleRad = ((sub.course - 90) * Math.PI) / 180;
		const newX = Number((position.x + dDistance * Math.cos(angleRad)).toFixed(3));
		const newY = Number((position.y - dDistance * Math.sin(angleRad)).toFixed(3));
		position.setPosition(newTime, newX, newY);
		const mySub = document.getElementById('my-sub');
		const newPosition = sub.position;
		mySub!.style.left = `calc(${12.5 * newPosition.x}% - 3px)`;
		mySub!.style.bottom = `calc(${12.5 * newPosition.y}% - 3px)`;
		const newSector = newPosition.sector;
		if (newSector !== this.lastReportedSector) {
			await this.report();
		}
	}

	parseCommand(shortText: string): Command | null {
		return null;
	}

	async executeCommand(command: Command) {}

	static calcAngle(x1: number, y1: number, x2: number, y2: number): number {
		return ((Math.atan2(x2 - x1, y2 - y1) * 180) / Math.PI + 360) % 360;
	}

	static calcBearing(x1: number, y1: number, x2: number, y2: number, ownCourse: number): number {
		return (Navigation.calcAngle(x1, y1, x2, y2) - ownCourse + 360) % 360;
	}
}
