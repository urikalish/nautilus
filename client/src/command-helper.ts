import { Game } from './model/game';
import { Command } from './model/command';

export class CommandHelper {
	game: Game;
	inputCommandElm: HTMLInputElement | null = null;
	command: Command | null = null;
	onParseCommand: (shortText: string) => Command | null;
	onExecuteCommand: (command: Command, cb?: () => void) => void | null;

	constructor(game: Game, onParseCommand: (shortText: string) => Command | null, onExecuteCommand: (command: Command, cb?: () => void) => void | null) {
		this.game = game;
		this.onParseCommand = onParseCommand;
		this.onExecuteCommand = onExecuteCommand;
	}

	markCommandStatus(status: string) {
		this.inputCommandElm!.classList.remove('empty', 'invalid', 'valid');
		this.inputCommandElm!.classList.add(status);
	}

	handleKeyDown(event) {
		console.log(this.inputCommandElm!.value.trim());
		if (this.inputCommandElm!.value.trim() === '' || event.key === 'Escape') {
			this.inputCommandElm!.value = '';
			this.markCommandStatus('empty');
			this.command = null;
		} else if (event.key === 'Enter') {
			if (this.command) {
				this.inputCommandElm!.value = '';
				this.markCommandStatus('empty');
				this.onExecuteCommand(this.command);
			}
		} else {
			console.log(this.inputCommandElm!.value.trim().toUpperCase());
			this.command = this.onParseCommand(this.inputCommandElm!.value.trim().toUpperCase());
			if (this.command) {
				this.markCommandStatus('valid');
			} else {
				this.markCommandStatus('invalid');
			}
		}
	}

	start() {
		this.inputCommandElm = document.getElementById('inp-command') as HTMLInputElement;
		this.inputCommandElm!.classList.remove('display--none');
		this.inputCommandElm!.focus();
		this.inputCommandElm!.addEventListener('keyup', this.handleKeyDown.bind(this));
	}
}
