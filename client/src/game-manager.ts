import { Game } from './model/game';
import { Sound } from './services/sound';
import { Conn } from './stations/conn';

export class GameManager {
	game: Game;
	conn: Conn;

	constructor(game: Game) {
		this.game = game;
		this.conn = new Conn(game);
	}

	start() {
		Sound.playEnvironmentSounds();
		this.conn.start();
	}
}
