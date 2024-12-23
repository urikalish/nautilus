import { Game } from './model/game';
import { Command, CommandType } from './model/command';
import { Station } from './model/station';

export class CommandHelper {
	game: Game;
	inputCommand: HTMLInputElement | null = null;
	onCommand: (Command) => void;

	constructor(game: Game, onCommand: (Command) => void) {
		this.game = game;
		this.onCommand = onCommand;
	}

	handleKeyDown(event) {
		if (event.key === 'Escape') {
			this.inputCommand!.value = '';
		} else if (event.key === 'Enter') {
			const command = new Command(Station.HELM, CommandType.SET_COURSE, 0);
			this.onCommand(command);
			this.inputCommand!.value = '';
		}
	}

	start() {
		this.inputCommand = document.getElementById('input-command') as HTMLInputElement;
		this.inputCommand!.classList.remove('display--none');
		this.inputCommand!.focus();
		this.inputCommand!.addEventListener('keydown', this.handleKeyDown.bind(this));
	}
}
