import { Speech } from '../services/speech';
import { Game } from '../model/game';
import { Command, CommandShortText, CommandType } from '../model/command';
import { Report } from '../model/report';
import { UiHelper } from '../services/ui-helper';
import { Station } from '../model/station';
import { StationType } from '../model/station-type';
import { Maneuvering } from './maneuvering';
import { Helm } from './helm';
import { Navigation } from './navigation';
import { Action, ActionType } from '../model/action';
import { Sonar } from './sonar';

export class Conn implements Station {
	type: StationType = StationType.CONN;
	stations: Station[];
	game: Game;
	uiHelper: UiHelper;
	actions: Action[] = [];

	constructor(game: Game, uiHelper: UiHelper) {
		this.game = game;
		this.stations = [
			new Navigation(game, this.addReportAction),
			new Helm(game, this.addReportAction),
			new Maneuvering(game, this.addReportAction),
			new Sonar(game, this.addReportAction),
		];
		this.uiHelper = uiHelper;
		this.uiHelper.setCallbacks(this.parseCommand, this.addCommandAction);
	}

	async start() {
		await Speech.connSpeak(`Aye`);
		await this.tick();
		this.uiHelper.enableCommand();
		const command = this.parseCommand(CommandShortText.ALL_STATIONS_REPORT);
		if (command) {
			this.addCommandAction(command);
		}
	}

	parseCommand: (shortText: string) => Command | null = (shortText: string) => {
		let command: Command | null = null;
		if (shortText === 'ASR') {
			return new Command(shortText, this.type, CommandType.ALL_STATIONS_REPORT, null, `All stations, report`);
		}
		for (const station of this.stations) {
			command = station.parseCommand(shortText);
			if (command) {
				break;
			}
		}
		return command;
	};

	async executeCommand(command: Command) {
		if (command.commandType === CommandType.ALL_STATIONS_REPORT) {
			await Speech.connSpeak(command.commandSpeechText);
			[
				CommandShortText.NAVIGATION_REPORT,
				CommandShortText.HELM_REPORT,
				CommandShortText.MANEUVERING_REPORT,
				CommandShortText.SONAR_REPORT,
			].forEach(cmdStr => {
				const command = this.parseCommand(cmdStr);
				if (command) {
					command.commandSpeechText = '';
					this.addCommandAction(command);
				}
			});
			return;
		}
		for (const station of this.stations) {
			if (command.stationType === station.type) {
				await Speech.connSpeak(command.commandSpeechText);
				await this.updateStationsAndUI();
				await station.executeCommand(command);
				break;
			}
		}
	}

	executeReport(report: Report) {
		Speech.stationSpeak(report.reportSpeechText, report.stationType).then(() => {});
		Speech.connSpeak(report.responseSpeechText).then(() => {});
	}

	async updateStationsAndUI() {
		for (const station of this.stations) {
			await station.tick();
		}
		this.uiHelper.tick();
	}

	async tick() {
		await this.updateStationsAndUI();
		setTimeout(this.tick.bind(this), 500);
	}

	handleActions: () => void = async () => {
		if (this.actions.length === 0) {
			return;
		}
		if (Speech.isTalking) {
			setTimeout(this.handleActions, 1000);
			return;
		}
		await this.updateStationsAndUI();
		const action = this.actions[0];
		if (action.actionType === ActionType.COMMAND) {
			const command = action as Command;
			this.actions.splice(0, 1);
			await this.executeCommand(command);
		} else if (this.actions[0].actionType === ActionType.REPORT) {
			const report = action as Report;
			this.actions.splice(0, 1);
			this.executeReport(report);
		}
		await this.updateStationsAndUI();
		if (this.actions.length > 0) {
			setTimeout(this.handleActions, 1000);
		}
	};

	addCommandAction: (command: Command) => void = (command: Command) => {
		this.actions.push(command);
		setTimeout(this.handleActions, 0);
	};

	addReportAction: (report: Report) => void = (report: Report) => {
		this.actions.push(report);
		setTimeout(this.handleActions, 0);
	};
}
