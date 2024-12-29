import { Game } from './model/game';

export class BoardHelper {
	game: Game;
	board: HTMLDivElement | null = null;

	constructor(game: Game) {
		this.game = game;
	}

	start() {
		this.board = document.getElementById('board') as HTMLDivElement;
		for (const x of ['H', 'G', 'F', 'E', 'D', 'C', 'B', 'A']) {
			for (let y = 1; y <= 8; y++) {
				const cell = document.createElement('div');
				cell.innerText = x + y;
				cell.dataset.id = x + y;
				cell.classList.add('board-cell');
				this.board?.appendChild(cell);
			}
		}
	}
}
