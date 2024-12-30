import { Game } from './model/game';
import { Command } from './model/command';
import { StationType } from './model/station-type';

export class CommandHelper {
	game: Game;
	inputCommand: HTMLInputElement | null = null;
	onCommand: (Command) => void | null = null;

	constructor(game: Game) {
		this.game = game;
	}

	setOnCommand(onCommand: (Command) => void) {
		this.onCommand = onCommand;
	}

	handleKeyDown(event) {
		if (event.key === 'Escape') {
			this.inputCommand!.value = '';
		} else if (event.key === 'Enter') {
			const command = new Command(StationType.HELM, 'set-course', 0);
			this.onCommand(command);
			this.inputCommand!.value = '';
		}
	}

	start() {
		this.inputCommand = document.getElementById('inp-command') as HTMLInputElement;
		this.inputCommand!.classList.remove('display--none');
		this.inputCommand!.focus();
		this.inputCommand!.addEventListener('keydown', this.handleKeyDown.bind(this));
	}
}
