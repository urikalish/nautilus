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
		const dTime = newTime - position.time;
		const dDistance = (sub.speed / 3600000) * dTime;
		const angleRadians = ((sub.course - 90) * Math.PI) / 180;
		position.setPosition(newTime, Number((position.x += dDistance * Math.cos(angleRadians)).toFixed(3)), Number((position.y -= dDistance * Math.sin(angleRadians)).toFixed(3)));
	}

	reportSector() {
		const position = this.getMyPosition();
		console.log(`position: ${position}`);
		const sector = position.sector;
		this.lastReportedSector = sector;
		Speech.speak(`Conn Navigation, current location, ${Speech.toNatoPhonetic(sector[0])}, ${Speech.toNatoPhonetic(sector[1])}`, 0, 2.0, 1.5, 1.0);
	}

	onTick() {
		this.updatePosition();
		const newPosition = this.getMyPosition();
		const newSector = newPosition.sector;
		if (newSector !== this.lastReportedSector) {
			this.reportSector();
		}
		setTimeout(this.onTick.bind(this), settings.reportInterval.navigation);
	}

	start() {
		setTimeout(this.onTick.bind(this), settings.reportInterval.navigation);
	}
}
