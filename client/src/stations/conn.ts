import { Speech } from '../services/speech';
import { Game } from '../model/game';
import { Command } from '../model/command';
import { BoardHelper } from '../board-helper';
import { Station } from './station';
import { StationType } from '../model/station-type';

export class Conn implements Station {
	type: StationType = StationType.CONN;
	stations: Station[];
	game: Game;
	inputCommandElm: HTMLInputElement | null = null;
	command: Command | null = null;
	boardHelper: BoardHelper;

	constructor(game: Game, stations: Station[], boardHelper: BoardHelper) {
		this.game = game;
		this.stations = stations;
		this.boardHelper = boardHelper;
	}

	async speak(text: string) {
		await Speech.speak(text, { pitch: 1.0, rate: 1.5 });
	}

	async report() {}

	async tick() {
		this.stations.forEach(station => {
			station.tick();
		});
		setTimeout(this.tick.bind(this), 1000);
	}

	handleCommandInputKeyUp(event) {
		this.inputCommandElm!.classList.remove('empty', 'invalid', 'valid');
		if (this.inputCommandElm!.value.trim() === '' || event.key === 'Escape') {
			this.inputCommandElm!.value = '';
			this.inputCommandElm!.classList.add('empty');
			this.command = null;
		} else if (event.key === 'Enter') {
			if (this.command) {
				this.inputCommandElm!.value = '';
				this.inputCommandElm!.classList.add('empty');
				this.executeCommand(this.command).then(() => {});
			}
		} else {
			this.command = this.parseCommand(this.inputCommandElm!.value.trim().toUpperCase());
			if (this.command) {
				this.inputCommandElm!.classList.add('valid');
			} else {
				this.inputCommandElm!.classList.add('invalid');
			}
		}
	}

	async start() {
		this.inputCommandElm = document.getElementById('inp-command') as HTMLInputElement;
		this.inputCommandElm!.classList.remove('display--none');
		this.inputCommandElm!.focus();
		this.inputCommandElm!.addEventListener('keyup', this.handleCommandInputKeyUp.bind(this));
		await this.speak(`Aye`);
		await this.speak(`All stations, report`);
		this.stations.forEach(station => {
			station.report();
		});
		this.tick().then(() => {});
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
