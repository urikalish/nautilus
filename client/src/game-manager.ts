import { Game } from './model/game';
import { Sound } from './services/sound';
import { Conn } from './stations/conn';
import { Navigation } from './stations/navigation';
import { Helm } from './stations/helm';
import { Engineering } from './stations/engineering';
import { BoardHelper } from './board-helper';

export class GameManager {
	game: Game;
	sound: Sound;
	boardHelper: BoardHelper;
	conn: Conn;
	engineering: Engineering;
	helm: Helm;
	navigation: Navigation;

	constructor(game: Game) {
		this.game = game;
		this.sound = new Sound();
		this.boardHelper = new BoardHelper(game);
		this.engineering = new Engineering(game);
		this.helm = new Helm(game);
		this.navigation = new Navigation(game);
		this.conn = new Conn(game, [this.navigation, this.helm, this.engineering], this.boardHelper);
	}

	start() {
		this.sound.start();
		this.boardHelper.start();
		this.conn.start();
	}
}
