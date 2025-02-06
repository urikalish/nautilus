import { Game } from '../model/game';
import { Command } from '../model/command';
import { toThreeDigits } from './utils';
import { settings } from '../model/settings';

export function showElement(elm: HTMLElement | null) {
	elm?.classList.remove('display--none');
}

export function hideElement(elm: HTMLElement | null) {
	elm?.classList.add('display--none');
}

function getElm(elmId: string): HTMLElement | null {
	return document.getElementById(elmId) || null;
}

export class UiHelper {
	game: Game;
	board: HTMLDivElement | null = null;
	boardMarkerMySub: HTMLImageElement | null = null;
	boardMarkerEnemySub: HTMLImageElement | null = null;
	pane1sub: HTMLDivElement | null = null;
	imgWheel2Outer: HTMLImageElement | null = null;
	commandPane: HTMLDivElement | null = null;
	inpCommand: HTMLInputElement | null = null;
	tmpCommand: Command | null = null;
	onParseCommand: ((shortText: string) => Command | null) | null = null;
	onAddCommandAction: ((command: Command) => void) | null = null;
	infoPane: HTMLDivElement | null = null;
	cnvWaterfall: HTMLCanvasElement | null = null;
	depthGaugeCurDepth: HTMLDivElement | null = null;

	constructor(game: Game) {
		this.game = game;
	}

	setCallbacks(parseCommandCB: (shortText: string) => Command | null, addCommandActionCB: (command: Command) => void) {
		this.onParseCommand = parseCommandCB;
		this.onAddCommandAction = addCommandActionCB;
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

	handleCommandInputKeyUp: (event) => void = event => {
		if (this.inpCommand!.value.trim() === '' || event.key === 'Escape') {
			this.setCommandInputStatus('empty');
			this.tmpCommand = null;
		} else if (event.key === 'Enter') {
			if (this.tmpCommand) {
				this.onAddCommandAction!(this.tmpCommand);
				this.setCommandInputStatus('empty');
				this.tmpCommand = null;
			}
		} else {
			this.tmpCommand = this.onParseCommand!(event.target.value.trim().toUpperCase());
			if (this.tmpCommand) {
				this.setCommandInputStatus('valid');
			} else {
				this.setCommandInputStatus('invalid');
			}
		}
	};

	refreshCanvas() {
		const context = this.cnvWaterfall!.getContext('2d');
		if (!context) {
			return;
		}
		const mySub = this.game.getMySub();
		for (let r = 0; r < mySub.waterfall.length; r++) {
			for (let c = 0; c < mySub.waterfall[r].length; c++) {
				context.fillStyle = `hsl(120, 100%, ${Math.trunc((mySub.waterfall[r][c] * 100) / 2)}%)`;
				context.fillRect(c, r, 1, 1);
			}
		}
	}

	refreshInfo() {
		const mySub = this.game.getMySub();
		this.infoPane!.innerHTML = '';
		const info = [
			'SECTOR',
			mySub.position.sector,
			'COURSE',
			toThreeDigits(Math.round(mySub.course)),
			'DEPTH (ft)',
			Math.round(mySub.depth),
			'SPEED (kts)',
			Math.round(mySub.speed),
		];
		for (let i = 0; i < info.length; i += 2) {
			const labelElm = document.createElement('div');
			labelElm.classList.add('info-label');
			labelElm.textContent = '' + info[i];
			this.infoPane!.appendChild(labelElm);
			const dataElm = document.createElement('div');
			dataElm.classList.add('info-data');
			dataElm.textContent = '' + info[i + 1];
			this.infoPane!.appendChild(dataElm);
		}
	}

	tick() {
		const mySub = this.game.getMySub();
		const enemySub = this.game.getEnemySub();
		this.boardMarkerMySub!.style.left = `${12.5 * mySub.position.x}%`;
		this.boardMarkerMySub!.style.bottom = `${12.5 * mySub.position.y}%`;
		showElement(this.boardMarkerMySub);
		this.boardMarkerEnemySub!.style.left = `${12.5 * enemySub.position.x}%`;
		this.boardMarkerEnemySub!.style.bottom = `${12.5 * enemySub.position.y}%`;
		showElement(this.boardMarkerEnemySub);
		this.pane1sub!.style.transform = `rotate(${mySub.rotation}deg`;
		const invertedRotation = -mySub.rotation;
		this.imgWheel2Outer!.style.transform = `rotate(${invertedRotation}deg`;
		this.depthGaugeCurDepth!.style.top = `${mySub.depth / 4 - 7}px`;
		this.depthGaugeCurDepth!.dataset.depth = Math.round(mySub.depth).toString();
		this.refreshCanvas();
		this.refreshInfo();
	}

	start() {
		this.board = getElm('board') as HTMLDivElement;
		this.boardMarkerMySub = getElm('board-marker-my-sub') as HTMLImageElement;
		this.boardMarkerEnemySub = getElm('board-marker-enemy-sub') as HTMLImageElement;
		this.pane1sub = getElm('pn-1-sub') as HTMLDivElement;
		this.imgWheel2Outer = getElm('img-wheel-2-outer') as HTMLImageElement;
		this.commandPane = getElm('command-pane') as HTMLDivElement;
		this.inpCommand = getElm('inp-command') as HTMLInputElement;
		this.inpCommand!.addEventListener('keyup', this.handleCommandInputKeyUp);
		this.cnvWaterfall = getElm('cnv-waterfall') as HTMLCanvasElement;
		this.cnvWaterfall.width = 360;
		this.cnvWaterfall.height = settings.sonar.waterfallRows;
		this.infoPane = getElm('info-pane') as HTMLDivElement;
		this.depthGaugeCurDepth = getElm('depth-gauge-cur-depth') as HTMLDivElement;
		this.createBoardSectorElements();
	}

	rotateElement(element, degrees, direction = 'right') {
		const currentTransform = window.getComputedStyle(element).getPropertyValue('rotate');
		const currentRotation = currentTransform === 'none' ? 0 : parseInt(currentTransform.replace('deg', ''));
		const rotationAmount = direction.toLowerCase() === 'left' ? -degrees : degrees;
		const newRotation = currentRotation + rotationAmount;
		element.style.rotate = `${newRotation}deg`;
	}
}
