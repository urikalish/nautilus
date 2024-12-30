import { Game } from './model/game';

export class BoardHelper {
	game: Game;
	board: HTMLDivElement | null = null;

	constructor(game: Game) {
		this.game = game;
	}

	start() {
		this.board = document.getElementById('board') as HTMLDivElement;
		for (let y = 8; y >= 1; y--) {
			for (const x of ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H']) {
				const cell = document.createElement('div');
				cell.innerText = x + y;
				cell.dataset.id = x + y;
				cell.classList.add('board-cell');
				this.board?.appendChild(cell);
			}
		}
	}
}
