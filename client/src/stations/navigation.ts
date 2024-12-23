import { Speech } from '../services/speech';
import { Game } from '../model/game';
import { Station } from '../model/station';

export class Navigation {
	station: Station = Station.NAVIGATION;
	game: Game;
	lastReportedSector: string = '';

	constructor(game: Game) {
		this.game = game;
	}

	speak(text: string, cb?: () => void) {
		Speech.speak(text, 0, 2.0, 1.5, 1.0, cb);
	}

	report(reportSector: boolean = true) {
		const sub = this.game.getMySub();
		const position = sub.position;
		console.log(`position: ${position}`);
		const sector = position.sector;
		this.lastReportedSector = sector;
		this.speak(`Conn Navigation ${reportSector ? `, current sector, ${Speech.toNatoPhonetic(sector[0])} ${Speech.toNatoPhonetic(sector[1])}` : ``}`);
	}

	update() {
		const sub = this.game.getMySub();
		const position = sub.position;
		const newTime = Date.now();
		const dTime = newTime - position.time;
		const dDistance = (sub.speed / 3600000) * dTime;
		const angleRadians = ((sub.course - 90) * Math.PI) / 180;
		const newX = Number((position.x + dDistance * Math.cos(angleRadians)).toFixed(3));
		const newY = Number((position.y - dDistance * Math.sin(angleRadians)).toFixed(3));
		position.setPosition(newTime, newX, newY);
		const newPosition = sub.position;
		const newSector = newPosition.sector;
		if (newSector !== this.lastReportedSector) {
			this.report(true);
		}
	}
}
