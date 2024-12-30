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

	async speak(text: string) {
		await Speech.speak(text, { pitch: 1.0, rate: 1.5 });
	}

	async report() {}

	async tick() {
		this.stations.forEach(station => {
			station.tick();
		});
		setTimeout(this.tick.bind(this), 10000);
	}

	async start() {
		this.commandHelper.start();
		await this.speak(`Aye`);
		await this.speak(`All stations, report`);
		this.stations.forEach(station => {
			station.report();
		});
		await this.tick();
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

	async executeCommand(command: Command) {
		for (const station of this.stations) {
			if (command.stationType === station.type) {
				await this.speak(command.speechText);
				await station.executeCommand(command);
				break;
			}
		}
	}
}
