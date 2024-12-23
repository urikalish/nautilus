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

	constructor(game: Game) {
		this.game = game;
		this.navigation = new Navigation(game);
		this.helm = new Helm(game);
		this.engineering = new Engineering(game);
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
		this.speak(`Aye`);
		this.speak(`All stations, report`, () => {
			this.navigation.report();
			this.helm.report();
			this.engineering.report();
			this.updateAll();
			this.commandHelper.start();
		});
	}

	handleCommandHandled() {
		this.speak(`Very well`);
	}

	handleCommand(command: Command) {
		let commandText;
		if (command.station === Station.HELM) {
			commandText = this.helm.getCommandText(command);
			this.speak(commandText, () => {
				this.helm.handleCommand(command, this.handleCommandHandled.bind(this));
			});
		}
	}
}
