import { Game } from '../model/game';
import { StationType } from '../model/station-type';
import { Station } from '../model/station';
import { Command, CommandShortText, CommandType } from '../model/command';
import { stationSpeak, toNatoPhoneticDigits } from '../services/speech';
import { Report, ReportType } from '../model/report';
import { EngineState } from '../model/engine-state';
import { settings } from '../model/settings';
import { addActiveCommand } from '../services/station-helper';
import { Sub } from '../model/sub';
import { roundDecimal } from '../services/utils';

export class Maneuvering implements Station {
	type: StationType = StationType.MANEUVERING;
	game: Game;
	activeCommands: Command[] = [];
	onAddReportAction: (report: Report) => void;

	constructor(game: Game, onAddReportAction: (report: Report) => void) {
		this.game = game;
		this.onAddReportAction = onAddReportAction;
	}

	getTargetSpeedByEngineState(state: EngineState): number {
		if (state === EngineState.FULL_STOP) {
			return 0;
		} else if (state === EngineState.THIRD) {
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
		} else if (state === EngineState.THIRD) {
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
			return new Command(
				shortText,
				this.type,
				CommandType.MANEUVERING_FULL_STOP,
				{ engineState: EngineState.FULL_STOP },
				`Maneuvering, full stop`,
				`Full stop, Maneuvering aye`,
				true,
			);
		}
		if (shortText === CommandShortText.MANEUVERING_ALL_AHEAD_THIRD) {
			return new Command(
				shortText,
				this.type,
				CommandType.MANEUVERING_ALL_AHEAD_THIRD,
				{ engineState: EngineState.THIRD },
				`Maneuvering, all ahead third`,
				`All ahead third, Maneuvering aye`,
				true,
			);
		}
		if (shortText === CommandShortText.MANEUVERING_ALL_AHEAD_TWO_THIRDS) {
			return new Command(
				shortText,
				this.type,
				CommandType.MANEUVERING_ALL_AHEAD_TWO_THIRDS,
				{ engineState: EngineState.TWO_THIRDS },
				`Maneuvering, all ahead two thirds`,
				`All ahead two thirds, Maneuvering aye`,
				true,
			);
		}
		if (shortText === CommandShortText.MANEUVERING_ALL_AHEAD_STANDARD) {
			return new Command(
				shortText,
				this.type,
				CommandType.MANEUVERING_ALL_AHEAD_STANDARD,
				{ engineState: EngineState.STANDARD },
				`Maneuvering, all ahead standard`,
				`All ahead standard, Maneuvering aye`,
				true,
			);
		}
		if (shortText === CommandShortText.MANEUVERING_ALL_AHEAD_FULL) {
			return new Command(
				shortText,
				this.type,
				CommandType.MANEUVERING_ALL_AHEAD_FULL,
				{ engineState: EngineState.FULL },
				`Maneuvering, all ahead full`,
				`All ahead full, Maneuvering aye`,
				true,
			);
		}
		if (shortText === CommandShortText.MANEUVERING_ALL_AHEAD_FLANK_CAVITATE) {
			return new Command(
				shortText,
				this.type,
				CommandType.MANEUVERING_ALL_AHEAD_FLANK_CAVITATE,
				{ engineState: EngineState.FLANK },
				`Maneuvering, all ahead flank cavitate`,
				`All ahead flank cavitate, Maneuvering aye`,
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
			return;
		}
		if (
			command.commandType === CommandType.MANEUVERING_FULL_STOP ||
			command.commandType === CommandType.MANEUVERING_ALL_AHEAD_THIRD ||
			command.commandType === CommandType.MANEUVERING_ALL_AHEAD_TWO_THIRDS ||
			command.commandType === CommandType.MANEUVERING_ALL_AHEAD_STANDARD ||
			command.commandType === CommandType.MANEUVERING_ALL_AHEAD_FULL ||
			command.commandType === CommandType.MANEUVERING_ALL_AHEAD_FLANK_CAVITATE
		) {
			await stationSpeak(command.responseSpeechText, this.type);
			addActiveCommand(command, this.activeCommands, [
				CommandType.MANEUVERING_FULL_STOP,
				CommandType.MANEUVERING_ALL_AHEAD_THIRD,
				CommandType.MANEUVERING_ALL_AHEAD_TWO_THIRDS,
				CommandType.MANEUVERING_ALL_AHEAD_STANDARD,
				CommandType.MANEUVERING_ALL_AHEAD_FULL,
				CommandType.MANEUVERING_ALL_AHEAD_FLANK_CAVITATE,
			]);
			return;
		}
	}

	async tick() {
		let i = 0;
		while (i < this.activeCommands.length) {
			const cmd = this.activeCommands[i];
			if (
				cmd.commandType === CommandType.MANEUVERING_FULL_STOP ||
				cmd.commandType === CommandType.MANEUVERING_ALL_AHEAD_THIRD ||
				cmd.commandType === CommandType.MANEUVERING_ALL_AHEAD_TWO_THIRDS ||
				cmd.commandType === CommandType.MANEUVERING_ALL_AHEAD_STANDARD ||
				cmd.commandType === CommandType.MANEUVERING_ALL_AHEAD_FULL ||
				cmd.commandType === CommandType.MANEUVERING_ALL_AHEAD_FLANK_CAVITATE
			) {
				const sub: Sub = this.game.getMySub();
				const delta = roundDecimal(((Date.now() - cmd.lastTickTime) / 1000) * settings.speed.changePerSec, 6);
				const targetSpeed = this.getTargetSpeedByEngineState(cmd.data.engineState);
				let d, speed;
				if (targetSpeed > sub.speed) {
					d = roundDecimal(targetSpeed - sub.speed - delta, 6);
					speed = d >= 0 ? sub.speed + delta : sub.speed + delta + d;
				} else {
					d = roundDecimal(sub.speed - targetSpeed - delta, 6);
					speed = d >= 0 ? sub.speed - delta : sub.speed - delta - d;
				}
				sub.speed = roundDecimal(speed, 6);
				cmd.lastTickTime = Date.now();
				if (sub.speed === targetSpeed) {
					this.activeCommands.splice(i, 1);
					this.onAddReportAction(
						new Report(
							this.type,
							ReportType.REPORT_SPEED,
							`Conn Maneuvering, current speed ${targetSpeed} knots`,
							`${targetSpeed} knots, aye`,
						),
					);
				} else {
					i++;
				}
			}
		}
	}
}
