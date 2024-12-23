import { Game } from '../model/game';
import { Navigation } from '../stations/navigation';
import { Engineering } from '../stations/engineering';
import { Sound } from './sound';
import { Speech } from './speech';
import { Helm } from '../stations/helm';

export class GameManager {
	game: Game;
	navigation: Navigation;
	helm: Helm;
	engineering: Engineering;

	constructor(game: Game, navigation: Navigation, helm: Helm, engineering: Engineering) {
		this.game = game;
		this.navigation = navigation;
		this.helm = helm;
		this.engineering = engineering;
	}

	speak(text: string, cb?: () => void) {
		Speech.speak(text, 0, 0.5, 1.5, 1.0, cb);
	}

	updateAll() {
		this.navigation.update();
		this.helm.update();
		this.engineering.update();
		setTimeout(this.updateAll.bind(this), 10000);
	}

	start() {
		Sound.playEnvironmentSounds();
		this.speak(`Aye`);
		this.speak(`All stations, report`, () => {
			this.updateAll();
		});
	}
}
