import { Game } from './model/game';

export class CommandManager {
	game: Game;
	inputCommand: HTMLInputElement | null = null;

	constructor(game: Game) {
		this.game = game;
	}

	handleKeyDown(event) {
		if (event.key === 'Escape') {
			this.inputCommand!.value = '';
		} else if (event.key === 'Enter') {
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
