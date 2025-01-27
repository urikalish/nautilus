import { Speech } from '../services/speech';
import { Game } from '../model/game';
import { Command } from '../model/command';
import { Report } from '../model/report';
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
	actions: Action[] = [];

	constructor(game: Game, uiHelper: UiHelper) {
		this.game = game;
		this.stations = [new Navigation(game), new Helm(game), new Engineering(game)];
		this.uiHelper = uiHelper;
		this.uiHelper.setCallbacks(this.parseCommand, this.addCommandAction);
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

	parseCommand: (shortText: string) => Command | null = (shortText: string) => {
		let command: Command | null = null;
		for (const station of this.stations) {
			command = station.parseCommand(shortText);
			if (command) {
				break;
			}
		}
		return command;
	};

	addCommandAction: (command: Command) => void = (command: Command) => {
		this.actions.push(command);
	};

	async executeCommand(command: Command) {
		for (const station of this.stations) {
			if (command.stationType === station.type) {
				await Speech.stationSpeak(command.commandSpeechText, this.type);
				await station.executeCommand(command);
				break;
			}
		}
	}

	async executeReport(report: Report) {
		await Speech.stationSpeak(report.reportSpeechText, report.stationType);
		await Speech.connSpeak(report.responseSpeechText);
	}

	async start() {
		await Speech.connSpeak(`Aye, all stations, report`);
		this.uiHelper.tick();
		for (const station of this.stations) {
			await station.report();
		}
		await this.tick();
		this.uiHelper.enableCommand();
	}
}
