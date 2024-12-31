import { Game } from './model/game';
import { Sound } from './services/sound';
import { Conn } from './stations/conn';
import { Navigation } from './stations/navigation';
import { Helm } from './stations/helm';
import { Engineering } from './stations/engineering';
import { UiHelper } from './ui-helper';

export class GameManager {
	game: Game;
	sound: Sound;
	uiHelper: UiHelper;
	conn: Conn;
	engineering: Engineering;
	helm: Helm;
	navigation: Navigation;

	constructor(game: Game) {
		this.game = game;
		this.sound = new Sound();
		this.uiHelper = new UiHelper(game);
		this.engineering = new Engineering(game);
		this.helm = new Helm(game, this.uiHelper);
		this.navigation = new Navigation(game, this.uiHelper);
		this.conn = new Conn(game, [this.navigation, this.helm, this.engineering], this.uiHelper);
	}

	async start() {
		this.sound.start();
		this.uiHelper.start();
		await this.conn.start();
	}
}
