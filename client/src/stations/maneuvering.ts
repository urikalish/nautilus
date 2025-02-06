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

	getEngineStateByCommandType(commandType: CommandType): EngineState {
		if (commandType === CommandType.MANEUVERING_FULL_STOP) {
			return EngineState.FULL_STOP;
		} else if (commandType === CommandType.MANEUVERING_ALL_AHEAD_THIRD) {
			return EngineState.THIRD;
		} else if (commandType === CommandType.MANEUVERING_ALL_AHEAD_TWO_THIRDS) {
			return EngineState.TWO_THIRDS;
		} else if (commandType === CommandType.MANEUVERING_ALL_AHEAD_STANDARD) {
			return EngineState.STANDARD;
		} else if (commandType === CommandType.MANEUVERING_ALL_AHEAD_FULL) {
			return EngineState.FULL;
		} else if (commandType === CommandType.MANEUVERING_ALL_AHEAD_FLANK_CAVITATE) {
			return EngineState.FLANK;
		}
		return EngineState.FULL_STOP;
	}

	getTargetSpeed(state: EngineState): number {
		if (state === EngineState.FULL_STOP) {
			return 0;
		} else if (state === EngineState.THIRD) {
			return settings.speed.third;
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

	getEngineStateCommandSpeech(state: EngineState): string {
		if (state === EngineState.FULL_STOP) {
			return 'full stop';
		} else if (state === EngineState.THIRD) {
			return 'all ahead third';
		} else if (state === EngineState.TWO_THIRDS) {
			return 'all ahead two thirds';
		} else if (state === EngineState.STANDARD) {
			return 'all ahead standard';
		} else if (state === EngineState.FULL) {
			return 'all ahead full';
		} else if (state === EngineState.FLANK) {
			return 'all ahead flank cavitate';
		}
		return 'unknown';
	}

	getEngineStateReportSpeech(state: EngineState): string {
		if (state === EngineState.FULL_STOP) {
			return 'stopped';
		} else if (state === EngineState.THIRD) {
			return 'ahead third';
		} else if (state === EngineState.TWO_THIRDS) {
			return 'ahead two thirds';
		} else if (state === EngineState.STANDARD) {
			return 'ahead standard';
		} else if (state === EngineState.FULL) {
			return 'ahead full';
		} else if (state === EngineState.FLANK) {
			return 'ahead flank cavitating';
		}
		return 'unknown';
	}

	getCommandTypeByShortText(shortText: string): CommandType {
		if (shortText === CommandShortText.MANEUVERING_FULL_STOP) {
			return CommandType.MANEUVERING_FULL_STOP;
		} else if (shortText === CommandShortText.MANEUVERING_ALL_AHEAD_THIRD) {
			return CommandType.MANEUVERING_ALL_AHEAD_THIRD;
		} else if (shortText === CommandShortText.MANEUVERING_ALL_AHEAD_TWO_THIRDS) {
			return CommandType.MANEUVERING_ALL_AHEAD_TWO_THIRDS;
		} else if (shortText === CommandShortText.MANEUVERING_ALL_AHEAD_STANDARD) {
			return CommandType.MANEUVERING_ALL_AHEAD_STANDARD;
		} else if (shortText === CommandShortText.MANEUVERING_ALL_AHEAD_FULL) {
			return CommandType.MANEUVERING_ALL_AHEAD_FULL;
		} else if (shortText === CommandShortText.MANEUVERING_ALL_AHEAD_FLANK_CAVITATE) {
			return CommandType.MANEUVERING_ALL_AHEAD_FLANK_CAVITATE;
		}
		return CommandType.MANEUVERING_FULL_STOP;
	}

	parseCommand(shortText: string): Command | null {
		if (shortText === CommandShortText.MANEUVERING_REPORT) {
			return new Command(CommandShortText.MANEUVERING_REPORT, this.type, CommandType.MANEUVERING_REPORT, null, 'Maneuvering, report');
		}
		if (
			shortText === CommandShortText.MANEUVERING_FULL_STOP ||
			shortText === CommandShortText.MANEUVERING_ALL_AHEAD_THIRD ||
			shortText === CommandShortText.MANEUVERING_ALL_AHEAD_TWO_THIRDS ||
			shortText === CommandShortText.MANEUVERING_ALL_AHEAD_STANDARD ||
			shortText === CommandShortText.MANEUVERING_ALL_AHEAD_FULL ||
			shortText === CommandShortText.MANEUVERING_ALL_AHEAD_FLANK_CAVITATE
		) {
			const commandType = this.getCommandTypeByShortText(shortText);
			const engineState = this.getEngineStateByCommandType(commandType);
			const engineStateSpeech = this.getEngineStateCommandSpeech(engineState);
			return new Command(
				shortText,
				this.type,
				commandType,
				{ engineState: this.getEngineStateByCommandType(commandType) },
				`Maneuvering, ${engineStateSpeech}`,
				`${engineStateSpeech}, Maneuvering aye`,
				true,
			);
		}
		return null;
	}

	async executeCommand(command: Command) {
		const sub = this.game.getMySub();
		if (command.commandType === CommandType.MANEUVERING_REPORT) {
			const state = sub.engineState;
			const speed = sub.speed;
			await stationSpeak(
				`Conn maneuvering, engine ${this.getEngineStateReportSpeech(state)}, speed ${toNatoPhoneticDigits(speed.toString())} knots`,
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
			sub.engineState = command.data.engineState;
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
				const targetSpeed = this.getTargetSpeed(cmd.data.engineState);
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
					const targetSpeedSpeech = toNatoPhoneticDigits(targetSpeed.toString());
					this.onAddReportAction(
						new Report(
							this.type,
							ReportType.REPORT_SPEED,
							`Conn Maneuvering, current speed ${targetSpeedSpeech} knots`,
							`${targetSpeedSpeech} knots, aye`,
						),
					);
				} else {
					i++;
				}
			}
		}
	}
}
