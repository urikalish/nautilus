import { Game } from '../model/game';

export class UiHelper {
	game: Game;
	board: HTMLDivElement | null = null;
	mySubMarker: HTMLDivElement | null = null;
	imgBearingWheel: HTMLImageElement | null = null;
	imgSubTop: HTMLImageElement | null = null;
	inputCommandElm: HTMLInputElement | null = null;

	constructor(game: Game) {
		this.game = game;
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
		this.inputCommandElm!.classList.remove('empty', 'invalid', 'valid');
		if (status === 'empty') {
			this.inputCommandElm!.value = '';
			this.inputCommandElm!.classList.add('empty');
		} else if (status === 'invalid') {
			this.inputCommandElm!.classList.add('invalid');
		} else if (status === 'valid') {
			this.inputCommandElm!.classList.add('valid');
		}
	}

	tick() {
		const mySub = this.game.getMySub();
		const mySubMarketSize = 7;
		this.mySubMarker!.style.left = `calc(${12.5 * mySub.position.x}% - ${Math.trunc(mySubMarketSize / 2)}px)`;
		this.mySubMarker!.style.bottom = `calc(${12.5 * mySub.position.y}% - ${Math.trunc(mySubMarketSize / 2)}px)`;
		this.imgBearingWheel!.style.transform = `scale(0.8) rotateZ(${mySub.course}deg`;
		this.imgSubTop!.style.transform = `scale(0.4) rotateZ(${mySub.course}deg`;
	}

	start() {
		this.board = document.getElementById('board') as HTMLDivElement;
		this.mySubMarker = document.getElementById('my-sub') as HTMLDivElement;
		this.imgBearingWheel = document.getElementById('img-bearing-wheel') as HTMLImageElement;
		this.imgSubTop = document.getElementById('img-sub-top') as HTMLImageElement;
		this.inputCommandElm = document.getElementById('inp-command') as HTMLInputElement;
		this.inputCommandElm!.classList.remove('display--none');
		this.inputCommandElm!.focus();
		this.createBoardSectorElements();
	}
}