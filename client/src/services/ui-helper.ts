import { Game } from '../model/game';

export class UiHelper {
	game: Game;
	board: HTMLDivElement | null = null;
	boardMarkerMySub: HTMLImageElement | null = null;
	boardMarkerEnemySub: HTMLImageElement | null = null;
	pane1sub: HTMLDivElement | null = null;
	imgWheel2Outer: HTMLImageElement | null = null;
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
		const enemySub = this.game.getEnemySub();
		this.boardMarkerMySub!.style.left = `${12.5 * mySub.position.x}%`;
		this.boardMarkerMySub!.style.bottom = `${12.5 * mySub.position.y}%`;
		UiHelper.showElement(this.boardMarkerMySub);
		this.boardMarkerEnemySub!.style.left = `${12.5 * enemySub.position.x}%`;
		this.boardMarkerEnemySub!.style.bottom = `${12.5 * enemySub.position.y}%`;
		UiHelper.showElement(this.boardMarkerEnemySub);
		this.pane1sub!.style.transform = `rotateZ(${mySub.course}deg`;
		this.imgWheel2Outer!.style.transform = `rotateZ(-${mySub.course}deg`;
	}

	start() {
		this.board = document.getElementById('board') as HTMLDivElement;
		this.boardMarkerMySub = document.getElementById('board-marker-my-sub') as HTMLImageElement;
		this.boardMarkerEnemySub = document.getElementById('board-marker-enemy-sub') as HTMLImageElement;
		this.pane1sub = document.getElementById('pn-1-sub') as HTMLDivElement;
		this.imgWheel2Outer = document.getElementById('img-wheel-2-outer') as HTMLImageElement;
		this.commandPane = document.getElementById('command-pane') as HTMLDivElement;
		this.inpCommand = document.getElementById('inp-command') as HTMLInputElement;
		this.createBoardSectorElements();
	}
}
