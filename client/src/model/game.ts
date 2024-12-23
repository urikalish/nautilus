import { Player } from './player';
import { Sub } from './sub';
import { getDateTime } from '../services/utils';
import { settings } from './settings';

export enum GameStatus {
	NA = '',
	CREATED = 'created',
	WAITING = 'waiting',
	STARTED = 'started',
	ENDED = 'ended',
}

export enum GameResult {
	NA = '',
	WIN_PLAYER_0 = 'winPlayer0',
	WIN_PLAYER_1 = 'winPlayer1',
}

export class Game {
	id: number;
	ind: number;
	creationTime: number;
	creationDate: string;
	status: GameStatus;
	result: GameResult;
	players: Player[];
	subs: Sub[];
	debug: boolean;

	constructor(id: number, date: Date, ind: number, players: Player[], subs: Sub[]) {
		this.debug = settings.debug;
		this.id = id;
		this.ind = ind;
		this.creationTime = date.getTime();
		this.creationDate = getDateTime(date);
		this.status = GameStatus.CREATED;
		this.result = GameResult.NA;
		this.players = players;
		this.subs = subs;
	}

	getMySub() {
		return this.subs[this.ind];
	}
}
