import { Game } from '../model/game';

export class UiHelper {
	game: Game;
	board: HTMLDivElement | null = null;
	boardMarkerMySub: HTMLDivElement | null = null;
	rotatingPane: HTMLDivElement | null = null;
	commandPane: HTMLDivElement | null = null;
	inpCommand: HTMLInputElement | null = null;

	constructor(game: Game) {
		this.game = game;
	}

	static showElement(elm: HTMLElement | null) {
		elm?.classList.remove('display--none');
	}

	static hideElement(elm: HTMLElement | null) {
		elm?.classList.add('display--none');
	}

	enableCommand() {
		this.commandPane?.classList.remove('visibility--hidden');
		this.inpCommand!.focus();
	}

	createBoardSectorElements() {
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

	setCommandInputStatus(status: string) {
		this.inpCommand!.classList.remove('empty', 'invalid', 'valid');
		if (status === 'empty') {
			this.inpCommand!.value = '';
			this.inpCommand!.classList.add('empty');
		} else if (status === 'invalid') {
			this.inpCommand!.classList.add('invalid');
		} else if (status === 'valid') {
			this.inpCommand!.classList.add('valid');
		}
	}

	tick() {
		const mySub = this.game.getMySub();
		const mySubMarketSize = 7;
		this.boardMarkerMySub!.style.left = `calc(${12.5 * mySub.position.x}% - ${Math.trunc(mySubMarketSize / 2)}px)`;
		this.boardMarkerMySub!.style.bottom = `calc(${12.5 * mySub.position.y}% - ${Math.trunc(mySubMarketSize / 2)}px)`;
		UiHelper.showElement(this.boardMarkerMySub);
		this.rotatingPane!.style.transform = `rotateZ(${mySub.course}deg`;
	}

	start() {
		this.board = document.getElementById('board') as HTMLDivElement;
		this.boardMarkerMySub = document.getElementById('board-marker-my-sub') as HTMLDivElement;
		this.rotatingPane = document.getElementById('rotating-pane') as HTMLImageElement;
		this.commandPane = document.getElementById('command-pane') as HTMLDivElement;
		this.inpCommand = document.getElementById('inp-command') as HTMLInputElement;
		this.createBoardSectorElements();
	}
}
