import { Game } from '../model/game';
import { StationType } from '../model/station-type';
import { Station } from '../model/station';
import { Command, CommandShortText, CommandType } from '../model/command';
import { Speech } from '../services/speech';
import { Report } from '../model/report';
import { EngineState } from '../model/engine-state';
import { settings } from '../model/settings';
import { Direction } from '../model/direction';

export class Maneuvering implements Station {
	type: StationType = StationType.MANEUVERING;
	game: Game;
	onAddReportAction: (report: Report) => void;

	constructor(game: Game, onAddReportAction: (report: Report) => void) {
		this.game = game;
		this.onAddReportAction = onAddReportAction;
	}

	getTargetSpeedByEngineState(state: EngineState): number {
		if (state === EngineState.FULL_STOP) {
			return 0;
		} else if (state === EngineState.ONE_THIRD) {
			return settings.speed.oneThird;
		} else if (state === EngineState.TWO_THIRDS) {
			return settings.speed.twoThirds;
		} else if (state === EngineState.STANDARD) {
			return settings.speed.standard;
		} else if (state === EngineState.FULL) {
			return settings.speed.full;
		} else if (state === EngineState.FLANK) {
			return settings.speed.flank;
		}
		return 0;
	}

	getEngineStateSpeechByEngineState(state: EngineState): string {
		if (state === EngineState.FULL_STOP) {
			return 'full stop';
		} else if (state === EngineState.ONE_THIRD) {
			return 'one third';
		} else if (state === EngineState.TWO_THIRDS) {
			return 'two thirds';
		} else if (state === EngineState.STANDARD) {
			return 'standard';
		} else if (state === EngineState.FULL) {
			return 'full';
		} else if (state === EngineState.FLANK) {
			return 'flank cavitating';
		}
		return 'unknown';
	}

	async tick() {}

	parseCommand(shortText: string): Command | null {
		if (shortText === CommandShortText.MANEUVERING_REPORT) {
			return new Command(CommandShortText.MANEUVERING_REPORT, this.type, CommandType.MANEUVERING_REPORT, null, 'Maneuvering, report');
		}
		if (shortText === CommandShortText.MANEUVERING_FULL_STOP) {
			return new Command(
				shortText,
				this.type,
				CommandType.MANEUVERING_FULL_STOP,
				{ change: Direction.DOWN, targetSpeed: this.getTargetSpeedByEngineState(EngineState.FULL_STOP) },
				`Maneuvering, full stop`,
				`Full stop, aye`,
				true,
			);
		}
		return null;
	}

	async executeCommand(command: Command) {
		if (command.shortText === CommandShortText.MANEUVERING_REPORT) {
			const state = this.game.getMySub().engineState;
			const speed = this.game.getMySub().speed;
			await Speech.stationSpeak(`Conn maneuvering, engine ${this.getEngineStateSpeechByEngineState(state)}, speed ${speed} knots`, this.type);
		}
	}
}
