import { Game } from './model/game';
import { Navigation } from './stations/navigation';
import { Engineering } from './stations/engineering';
import { Sound } from './services/sound';
import { Speech } from './services/speech';
import { Helm } from './stations/helm';
import { CommandHelper } from './command-helper';
import { Command } from './model/command';
import { Station } from './model/station';

export class GameManager {
	game: Game;
	navigation: Navigation;
	helm: Helm;
	engineering: Engineering;
	commandHelper: CommandHelper;

	constructor(game: Game) {
		this.game = game;
		this.navigation = new Navigation(game);
		this.helm = new Helm(game);
		this.engineering = new Engineering(game);
		this.commandHelper = new CommandHelper(game, this.handleCommand.bind(this));
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

	handleCommand(command: Command) {
		let commandText;
		if (command.station === Station.NAVIGATION) {
			//this.navigation.handleCommand(command);
		} else if (command.station === Station.HELM) {
			commandText = this.helm.getCommandText(command);
			this.speak(commandText, () => {
				this.helm.handleCommand(command);
			});
		} else if (command.station === Station.ENGINEERING) {
			//this.engineering.handleCommand(command);
		}
	}

	start() {
		Sound.playEnvironmentSounds();
		this.commandHelper.start();
		this.speak(`Aye`);
		this.speak(`All stations, report`, () => {
			this.updateAll();
		});
	}
}
