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

	constructor(game: Game, stations: Station[], boardHelper: BoardHelper) {
		this.game = game;
		this.stations = stations;
		this.boardHelper = boardHelper;
		this.commandHelper = new CommandHelper(game, this.parseCommand.bind(this), this.executeCommand.bind(this));
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
		this.commandHelper.start();
		this.speak(`Aye`);
		this.speak(`All stations, report`, () => {
			this.stations.forEach(station => {
				station.report();
			});
			this.tick();
		});
	}

	parseCommand(shortText: string): Command | null {
		let command: Command | null = null;
		for (const station of this.stations) {
			command = station.parseCommand(shortText);
			if (command) {
				break;
			}
		}
		return command;
	}

	executeCommand(command: Command, cb?: () => void) {
		for (const station of this.stations) {
			if (command.stationType === station.type) {
				this.speak(command.speechText, () => {
					station.executeCommand(command, () => {
						this.speak(`Aye`);
						if (cb) {
							cb();
						}
					});
				});
				break;
			}
		}
	}
}
