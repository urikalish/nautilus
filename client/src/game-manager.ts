import { Game } from './model/game';
import { Sound } from './services/sound';
import { Conn } from './stations/conn';
import { UiHelper } from './services/ui-helper';

export class GameManager {
	game: Game;
	sound: Sound;
	uiHelper: UiHelper;
	conn: Conn;

	constructor(game: Game) {
		this.game = game;
		this.sound = new Sound();
		this.uiHelper = new UiHelper(game);
		this.conn = new Conn(game, this.uiHelper);
	}

	async start() {
		this.sound.start();
		this.uiHelper.start();
		await this.conn.start();
	}
}
