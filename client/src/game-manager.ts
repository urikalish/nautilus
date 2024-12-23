import { Game } from './model/game';
import { Navigation } from './stations/navigation';
import { Engineering } from './stations/engineering';
import { Sound } from './services/sound';
import { Helm } from './stations/helm';
import { Conn } from './stations/conn';

export class GameManager {
	game: Game;
	conn: Conn;
	navigation: Navigation;
	helm: Helm;
	engineering: Engineering;

	constructor(game: Game) {
		this.game = game;
		this.navigation = new Navigation(game);
		this.helm = new Helm(game);
		this.engineering = new Engineering(game);
		this.conn = new Conn(game, this.navigation, this.helm, this.engineering);
	}

	start() {
		Sound.playEnvironmentSounds();
		this.conn.start();
	}
}
