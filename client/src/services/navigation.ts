import { settings } from '../model/settings';
import { Game } from '../model/game';
import { Speech } from './speech';

export class Navigation {
	game: Game;
	lastReportedSector: string = '';

	constructor(game: Game) {
		this.game = game;
	}

	getMySub() {
		return this.game.subs[this.game.ind];
	}

	getMyPosition() {
		return this.getMySub().position;
	}

	updatePosition() {
		const sub = this.getMySub();
		const position = this.getMyPosition();
		const newTime = Date.now();
		const deltaTimeMs = newTime - position.time;
		const deltaDistanceMiles = (sub.speedKnots / 3600000) * deltaTimeMs;
		const angleRadians = ((sub.courseDeg - 90) * Math.PI) / 180;
		position.setPosition(
			newTime,
			Number((position.x += deltaDistanceMiles * Math.cos(angleRadians)).toFixed(3)),
			Number((position.y -= deltaDistanceMiles * Math.sin(angleRadians)).toFixed(3)),
		);
	}

	reportSector() {
		const position = this.getMyPosition();
		const sector = position.sector;
		this.lastReportedSector = sector;
		Speech.speak(`Conn Navigation, current location sector, ${Speech.toNatoPhonetic(sector[0])}, ${Speech.toNatoPhonetic(sector[1])}`, 0, 2.0, 1.5, 1.0);
	}

	onTick() {
		this.updatePosition();
		const newPosition = this.getMyPosition();
		const newSector = newPosition.sector;
		console.log(`position: ${newPosition}`);
		if (newSector !== this.lastReportedSector) {
			this.reportSector();
		}
		setTimeout(this.onTick.bind(this), settings.reportIntervalNavigation);
	}

	start() {
		setTimeout(this.onTick.bind(this), settings.reportIntervalNavigation);
	}
}
