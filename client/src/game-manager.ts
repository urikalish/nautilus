import { Game } from './model/game';
import { Navigation } from './stations/navigation';
import { Engineering } from './stations/engineering';
import { Sound } from './services/sound';
import { Speech } from './services/speech';
import { Helm } from './stations/helm';
import { CommandManager } from './command-manager';

export class GameManager {
	game: Game;
	navigation: Navigation;
	helm: Helm;
	engineering: Engineering;
	commandManager: CommandManager;

	constructor(game: Game) {
		this.game = game;
		this.navigation = new Navigation(game);
		this.helm = new Helm(game);
		this.engineering = new Engineering(game);
		this.commandManager = new CommandManager(game);
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
		this.commandManager.start();
		this.speak(`Aye`);
		this.speak(`All stations, report`, () => {
			this.updateAll();
		});
	}
}
