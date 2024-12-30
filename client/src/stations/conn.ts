import { Speech } from '../services/speech';
import { Game } from '../model/game';
import { CommandHelper } from '../command-helper';
import { Command } from '../model/command';
import { BoardHelper } from '../board-helper';
import { Station } from './station';
import { StationType } from '../model/station-type';

export class Conn implements Station {
	type: StationType = StationType.CONN;
	stations: Station[];
	game: Game;
	commandHelper: CommandHelper;
	boardHelper: BoardHelper;
	commands: Command[] = [];

	constructor(game: Game, stations: Station[], boardHelper: BoardHelper, commandHelper: CommandHelper) {
		this.game = game;
		this.stations = stations;
		this.boardHelper = boardHelper;
		this.commandHelper = commandHelper;
		this.commandHelper.setOnCommand(this.handleCommand.bind(this));
	}

	speak(text: string, cb?: () => void) {
		Speech.speak(text, 0, 1.0, 1.5, 1.0, cb);
	}

	report() {}

	tick() {
		this.stations.forEach(station => {
			station.tick();
		});
		setTimeout(this.tick.bind(this), 10000);
	}

	start() {
		this.boardHelper.start();
		this.commandHelper.start();
		this.speak(`Aye`);
		this.speak(`All stations, report`, () => {
			this.stations.forEach(station => {
				station.report();
			});
			this.tick();
		});
	}

	handleCommandHandled() {
		this.speak(`Very well`);
	}

	handleCommand(command: Command) {
		let commandText;
		if (command.stationType === StationType.HELM) {
			commandText = this.helm.getCommandText(command);
			this.speak(commandText, () => {
				this.helm.handleCommand(command, this.handleCommandHandled.bind(this));
			});
		}
	}
}
