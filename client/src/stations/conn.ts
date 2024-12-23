import { Speech } from '../services/speech';
import { Game } from '../model/game';
import { Station } from '../model/station';
import { Navigation } from './navigation';
import { Helm } from './helm';
import { Engineering } from './engineering';
import { CommandHelper } from '../command-helper';
import { Command } from '../model/command';

export class Conn {
	station: Station = Station.CONN;
	navigation: Navigation;
	helm: Helm;
	engineering: Engineering;
	game: Game;
	commandHelper: CommandHelper;

	constructor(game: Game, navigation: Navigation, helm: Helm, engineering: Engineering) {
		this.game = game;
		this.navigation = navigation;
		this.helm = helm;
		this.engineering = engineering;
		this.commandHelper = new CommandHelper(game, this.handleCommand.bind(this));
	}

	speak(text: string, cb?: () => void) {
		Speech.speak(text, 0, 1.0, 1.5, 1.0, cb);
	}

	updateAll() {
		this.navigation.update();
		this.helm.update();
		this.engineering.update();
		setTimeout(this.updateAll.bind(this), 10000);
	}

	start() {
		this.commandHelper.start();
		this.speak(`Aye`);
		this.speak(`All stations, report`, () => {
			this.updateAll();
		});
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
}
