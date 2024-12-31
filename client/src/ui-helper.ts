import { Game } from './model/game';
import { Sub } from './model/sub';

export class UiHelper {
	game: Game;
	board: HTMLDivElement | null = null;
	mySubMarker: HTMLDivElement | null = null;
	imgBearingWheel: HTMLImageElement | null = null;
	imgSubTop: HTMLImageElement | null = null;

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

	updateMySubMarkerPosition(mySub: Sub) {
		const marketSize = 7;
		this.mySubMarker!.style.left = `calc(${12.5 * mySub.position.x}% - ${Math.trunc(marketSize / 2)}px)`;
		this.mySubMarker!.style.bottom = `calc(${12.5 * mySub.position.y}% - ${Math.trunc(marketSize / 2)}px)`;
	}

	updateMySubCourseAndBearing(mySub: Sub) {
		this.imgBearingWheel!.style.transform = `scale(0.8) rotateZ(${mySub.course}deg`;
		this.imgSubTop!.style.transform = `scale(0.4) rotateZ(${mySub.course}deg`;
	}

	start() {
		this.board = document.getElementById('board') as HTMLDivElement;
		this.mySubMarker = document.getElementById('my-sub') as HTMLDivElement;
		this.imgBearingWheel = document.getElementById('img-bearing-wheel') as HTMLImageElement;
		this.imgSubTop = document.getElementById('img-sub-top') as HTMLImageElement;
		this.createBoardSectorElements();
	}
}
