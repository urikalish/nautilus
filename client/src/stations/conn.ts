import { Speech } from '../services/speech';
import { Game } from '../model/game';
import { Command } from '../model/command';
import { UiHelper } from '../services/ui-helper';
import { Station } from '../model/station';
import { StationType } from '../model/station-type';
import { Engineering } from './engineering';
import { Helm } from './helm';
import { Navigation } from './navigation';
import { Action, ActionType } from '../model/action';

export class Conn implements Station {
	type: StationType = StationType.CONN;
	stations: Station[];
	game: Game;
	uiHelper: UiHelper;
	tmpCommand: Command | null = null;
	actions: Action[] = [];

	constructor(game: Game, uiHelper: UiHelper) {
		this.game = game;
		this.stations = [new Navigation(game), new Helm(game), new Engineering(game)];
		this.uiHelper = uiHelper;
	}

	async report() {}

	async tick() {
		this.stations.forEach(station => {
			station.tick();
		});
		this.uiHelper.tick();
		if (this.actions.length > 0) {
			if (this.actions[0].actionType === ActionType.COMMAND) {
				const cmd = this.actions[0] as Command;
				this.actions.splice(0, 1);
				await this.executeCommand(cmd);
			}
		}
		setTimeout(this.tick.bind(this), 1000);
	}

	async handleCommandInputKeyUp(event) {
		if (this.uiHelper.inpCommand!.value.trim() === '' || event.key === 'Escape') {
			this.uiHelper.setCommandInputStatus('empty');
			this.tmpCommand = null;
		} else if (event.key === 'Enter') {
			if (this.tmpCommand) {
				this.actions.push(this.tmpCommand);
				this.uiHelper.setCommandInputStatus('empty');
				this.tmpCommand = null;
			}
		} else {
			this.tmpCommand = this.parseCommand(event.target.value.trim().toUpperCase());
			if (this.tmpCommand) {
				this.uiHelper.setCommandInputStatus('valid');
			} else {
				this.uiHelper.setCommandInputStatus('invalid');
			}
		}
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
				await Speech.stationSpeak(command.commandSpeechText, this.type);
				await station.executeCommand(command);
				break;
			}
		}
	}

	async start() {
		this.uiHelper.inpCommand!.addEventListener('keyup', this.handleCommandInputKeyUp.bind(this));
		await Speech.stationSpeak(`Aye, all stations, report`, this.type);
		this.uiHelper.tick();
		for (const station of this.stations) {
			await station.report();
		}
		await this.tick();
		this.uiHelper.enableCommand();
	}
}
