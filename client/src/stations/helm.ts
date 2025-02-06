import { stationSpeak, toNatoPhoneticDigits } from '../services/speech';
import { Game } from '../model/game';
import { Command, CommandShortText, CommandType } from '../model/command';
import { Sub } from '../model/sub';
import { StationType } from '../model/station-type';
import { Station } from '../model/station';
import { Direction } from '../model/direction';
import { settings } from '../model/settings';
import { roundDecimal, toThreeDigits } from '../services/utils';
import { Report, ReportType } from '../model/report';
import { addActiveCommand } from '../services/station-helper';

export class Helm implements Station {
	type: StationType = StationType.HELM;
	game: Game;
	onAddReportAction: (report: Report) => void;
	activeCommands: Command[] = [];

	constructor(game: Game, onAddReportAction: (report: Report) => void) {
		this.game = game;
		this.onAddReportAction = onAddReportAction;
	}

	parseCommand(shortText: string): Command | null {
		if (shortText === CommandShortText.HELM_REPORT) {
			return new Command(CommandShortText.HELM_REPORT, this.type, CommandType.HELM_REPORT, null, 'Helm, report');
		} else if (shortText.startsWith(CommandShortText.HELM_RIGHT_RUDDER_SET_COURSE)) {
			const m = new RegExp(`^${CommandShortText.HELM_RIGHT_RUDDER_SET_COURSE}([0-3][0-9][0-9])$`).exec(shortText);
			if (!m) {
				return null;
			}
			const course = parseInt(m[1]);
			if (course >= 360) {
				return null;
			}
			const coursePhonetic = toNatoPhoneticDigits(toThreeDigits(course));
			return new Command(
				shortText,
				this.type,
				CommandType.HELM_RIGHT_RUDDER_SET_COURSE,
				{ course, direction: Direction.RIGHT },
				`Helm, right rudder steer course ${coursePhonetic}`,
				`Right rudder steer course ${coursePhonetic}, Helm aye`,
				true,
			);
		} else if (shortText.startsWith(CommandShortText.HELM_LEFT_RUDDER_SET_COURSE)) {
			const m = new RegExp(`^${CommandShortText.HELM_LEFT_RUDDER_SET_COURSE}([0-3][0-9][0-9])$`).exec(shortText);
			if (!m) {
				return null;
			}
			const course = parseInt(m[1]);
			if (course >= 360) {
				return null;
			}
			const coursePhonetic = toNatoPhoneticDigits(toThreeDigits(course));
			return new Command(
				shortText,
				this.type,
				CommandType.HELM_LEFT_RUDDER_SET_COURSE,
				{ course, direction: Direction.LEFT },
				`Helm, left rudder steer course ${coursePhonetic}`,
				`Left rudder steer course ${coursePhonetic}, Helm aye`,
				true,
			);
		} else if (shortText.startsWith(CommandShortText.HELM_MAKE_MY_DEPTH)) {
			const m = new RegExp(`^${CommandShortText.HELM_MAKE_MY_DEPTH}(\\d{0,4})F$`).exec(shortText);
			if (!m) {
				return null;
			}
			const depth = parseInt(m[1]);
			if (depth < 0 || depth > settings.depth.max) {
				return null;
			}
			const depthPhonetic = toNatoPhoneticDigits('' + depth);
			return new Command(
				shortText,
				this.type,
				CommandType.HELM_MAKE_MY_DEPTH,
				{ depth },
				`Helm, make my depth ${depthPhonetic} feet`,
				`Make my depth ${depthPhonetic} feet, Helm aye`,
				true,
			);
		}
		return null;
	}

	async executeCommand(command: Command) {
		if (command.commandType === CommandType.HELM_REPORT) {
			const course = this.game.getMySub().course;
			const depth = this.game.getMySub().depth;
			const coursePhonetic = toNatoPhoneticDigits(toThreeDigits(course));
			await stationSpeak(`Conn Helm, course ${coursePhonetic}, depth ${toNatoPhoneticDigits(depth.toString())} feet`, this.type);
			return;
		}
		if (command.commandType === CommandType.HELM_RIGHT_RUDDER_SET_COURSE || command.commandType === CommandType.HELM_LEFT_RUDDER_SET_COURSE) {
			await stationSpeak(command.responseSpeechText, this.type);
			addActiveCommand(command, this.activeCommands, [CommandType.HELM_RIGHT_RUDDER_SET_COURSE, CommandType.HELM_LEFT_RUDDER_SET_COURSE]);
			return;
		}
		if (command.commandType === CommandType.HELM_MAKE_MY_DEPTH) {
			await stationSpeak(command.responseSpeechText, this.type);
			addActiveCommand(command, this.activeCommands, [CommandType.HELM_MAKE_MY_DEPTH]);
			return;
		}
	}

	getCourseByRotation(rotation: number) {
		let course = rotation % 360;
		if (course < 0) {
			course += 360;
		}
		return course;
	}

	async tick() {
		const sub: Sub = this.game.getMySub();
		let i = 0;
		while (i < this.activeCommands.length) {
			const cmd = this.activeCommands[i];
			if (cmd.commandType === CommandType.HELM_RIGHT_RUDDER_SET_COURSE || cmd.commandType === CommandType.HELM_LEFT_RUDDER_SET_COURSE) {
				const delta = roundDecimal(((Date.now() - cmd.lastTickTime) / 1000) * settings.steer.degPerSec, 6);
				let d;
				if (cmd.data.direction === Direction.RIGHT) {
					const targetCourse = cmd.data.course >= sub.course ? cmd.data.course : cmd.data.course + 360;
					d = roundDecimal(targetCourse - sub.course - delta, 6);
					sub.rotation = d >= 0 ? sub.rotation + delta : sub.rotation + delta + d;
				} else {
					const sourceCourse = sub.course >= cmd.data.course ? sub.course : sub.course + 360;
					d = roundDecimal(sourceCourse - cmd.data.course - delta, 6);
					sub.rotation = d >= 0 ? sub.rotation - delta : sub.rotation - delta - d;
				}
				sub.course = roundDecimal(this.getCourseByRotation(sub.rotation), 6);
				cmd.lastTickTime = Date.now();
				if (sub.course === cmd.data.course) {
					this.activeCommands.splice(i, 1);
					const threeDigitsCourse = toNatoPhoneticDigits(toThreeDigits(sub.course));
					this.onAddReportAction(
						new Report(
							this.type,
							ReportType.REPORT_COURSE,
							`Conn Helm, steady course, ${threeDigitsCourse}`,
							`${threeDigitsCourse}, aye`,
						),
					);
				} else {
					i++;
				}
			}
			if (cmd.commandType === CommandType.HELM_MAKE_MY_DEPTH) {
				const delta = roundDecimal(((Date.now() - cmd.lastTickTime) / 1000) * settings.depth.feetPerSec, 6);
				let d, depth;
				if (cmd.data.depth > sub.depth) {
					d = roundDecimal(cmd.data.depth - sub.depth - delta, 6);
					depth = d >= 0 ? sub.depth + delta : sub.depth + delta + d;
				} else {
					d = roundDecimal(sub.depth - cmd.data.depth - delta, 6);
					depth = d >= 0 ? sub.depth - delta : sub.depth - delta - d;
				}
				sub.depth = roundDecimal(depth, 6);
				cmd.lastTickTime = Date.now();
				if (sub.depth === cmd.data.depth) {
					this.activeCommands.splice(i, 1);
					this.onAddReportAction(
						new Report(this.type, ReportType.REPORT_DEPTH, `Conn Helm, current depth ${sub.depth} feet`, `${sub.depth} feet, aye`),
					);
				} else {
					i++;
				}
			}
		}
	}
}
