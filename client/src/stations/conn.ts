import { Speech } from '../services/speech';
import { Game } from '../model/game';
import { Command } from '../model/command';
import { UiHelper } from '../services/ui-helper';
import { Station } from '../model/station';
import { StationType } from '../model/station-type';
import { Engineering } from './engineering';
import { Helm } from './helm';
import { Navigation } from './navigation';

export class Conn implements Station {
	type: StationType = StationType.CONN;
	stations: Station[];
	game: Game;
	uiHelper: UiHelper;
	command: Command | null = null;

	constructor(game: Game, uiHelper: UiHelper) {
		this.game = game;
		this.stations = [new Engineering(game), new Helm(game), new Navigation(game)];
		this.uiHelper = uiHelper;
	}

	async speak(text: string) {
		await Speech.speak(text, { pitch: 1.0, rate: 1.5 });
	}

	async report() {}

	async tick() {
		this.stations.forEach(station => {
			station.tick();
		});
		this.uiHelper.tick();
		setTimeout(this.tick.bind(this), 1000);
	}

	async handleCommandInputKeyUp(event) {
		if (this.uiHelper.inputCommandElm!.value.trim() === '' || event.key === 'Escape') {
			this.uiHelper.setCommandInputStatus('empty');
			this.command = null;
		} else if (event.key === 'Enter') {
			if (this.command) {
				this.uiHelper.setCommandInputStatus('empty');
				await this.executeCommand(this.command);
			}
		} else {
			this.command = this.parseCommand(event.target.value.trim().toUpperCase());
			if (this.command) {
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
				await this.speak(command.speechText);
				await station.executeCommand(command);
				break;
			}
		}
	}

	async start() {
		this.uiHelper.inputCommandElm!.addEventListener('keyup', this.handleCommandInputKeyUp.bind(this));
		await this.speak(`Aye`);
		await this.speak(`All stations, report`);
		this.uiHelper.tick();
		for (const station of this.stations) {
			await station.report();
		}
		await this.tick();
	}
}
