import { Player } from './player';
import { Sub } from './sub';
import { getDateTime } from '../utils/utils';
import { settings } from './settings';

export enum GameStatus {
	CREATED = 'created',
	WAITING = 'waiting',
	STARTED = 'started',
	ENDED = 'ended',
}

export enum GameResult {
	NONE = '',
	WIN_PLAYER_0 = 'winPlayer0',
	WIN_PLAYER_1 = 'winPlayer1',
}

export class Game {
	id: number;
	creationTime: number;
	creationDate: string;
	status: GameStatus;
	result: GameResult;
	players: Player[];
	subs: Sub[];
	debug: boolean;

	constructor(id: number) {
		this.id = id;
		const now = new Date();
		this.creationTime = now.getTime();
		this.creationDate = getDateTime(now);
		this.status = GameStatus.CREATED;
		this.result = GameResult.NONE;
		this.players = [new Player(0), new Player(1)];
		this.subs = [new Sub(0), new Sub(1)];
		this.debug = settings.debug;
	}
}
