import { Game } from '../model/game';
import { StationType } from '../model/station-type';
import { Station } from '../model/station';
import { Command, CommandShortText, CommandType } from '../model/command';
import { stationSpeak, toNatoPhoneticDigits } from '../services/speech';
import { Report } from '../model/report';
import { EngineState } from '../model/engine-state';
import { settings } from '../model/settings';

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

	parseCommand(shortText: string): Command | null {
		if (shortText === CommandShortText.MANEUVERING_REPORT) {
			return new Command(CommandShortText.MANEUVERING_REPORT, this.type, CommandType.MANEUVERING_REPORT, null, 'Maneuvering, report');
		}
		if (shortText === CommandShortText.MANEUVERING_FULL_STOP) {
			return new Command(shortText, this.type, CommandType.MANEUVERING_FULL_STOP, null, `Maneuvering, full stop`, `Full stop, aye`, true);
		}
		if (shortText === CommandShortText.MANEUVERING_ALL_AHEAD_THIRD) {
			return new Command(
				shortText,
				this.type,
				CommandType.MANEUVERING_ALL_AHEAD_THIRD,
				null,
				`Maneuvering, all ahead third`,
				`All ahead third, aye`,
				true,
			);
		}
		if (shortText === CommandShortText.MANEUVERING_ALL_AHEAD_TWO_THIRDS) {
			return new Command(
				shortText,
				this.type,
				CommandType.MANEUVERING_ALL_AHEAD_TWO_THIRDS,
				null,
				`Maneuvering, all ahead two thirds`,
				`All ahead two thirds, aye`,
				true,
			);
		}
		if (shortText === CommandShortText.MANEUVERING_ALL_AHEAD_STANDARD) {
			return new Command(
				shortText,
				this.type,
				CommandType.MANEUVERING_ALL_AHEAD_STANDARD,
				null,
				`Maneuvering, all ahead standard`,
				`All ahead standard, aye`,
				true,
			);
		}
		if (shortText === CommandShortText.MANEUVERING_ALL_AHEAD_FULL) {
			return new Command(
				shortText,
				this.type,
				CommandType.MANEUVERING_ALL_AHEAD_FULL,
				null,
				`Maneuvering, all ahead full`,
				`All ahead full, aye`,
				true,
			);
		}
		if (shortText === CommandShortText.MANEUVERING_ALL_AHEAD_FLANK_CAVITATE) {
			return new Command(
				shortText,
				this.type,
				CommandType.MANEUVERING_ALL_AHEAD_FLANK_CAVITATE,
				null,
				`Maneuvering, all ahead flank cavitate`,
				`All ahead flank cavitate, aye`,
				true,
			);
		}
		return null;
	}

	async executeCommand(command: Command) {
		if (command.commandType === CommandType.MANEUVERING_REPORT) {
			const state = this.game.getMySub().engineState;
			const speed = this.game.getMySub().speed;
			await stationSpeak(
				`Conn maneuvering, engine ${this.getEngineStateSpeechByEngineState(state)}, speed ${toNatoPhoneticDigits(speed.toString())} knots`,
				this.type,
			);
		}
	}

	async tick() {}
}
