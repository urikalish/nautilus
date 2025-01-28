import { Speech } from '../services/speech';
import { Game } from '../model/game';
import { Command, CommandShortText, CommandType } from '../model/command';
import { Sub } from '../model/sub';
import { StationType } from '../model/station-type';
import { Station } from '../model/station';
import { Direction } from '../model/direction';
import { settings } from '../model/settings';
import { roundDecimal } from '../services/utils';
import { Report, ReportType } from '../model/report';

export class Helm implements Station {
	type: StationType = StationType.HELM;
	game: Game;
	onAddReportAction: (report: Report) => void;
	activeCommands: Command[] = [];

	constructor(game: Game, onAddReportAction: (report: Report) => void) {
		this.game = game;
		this.onAddReportAction = onAddReportAction;
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
			if (cmd.commandType === CommandType.RIGHT_RUDDER_SET_COURSE || cmd.commandType === CommandType.LEFT_RUDDER_SET_COURSE) {
				const delta = roundDecimal(((Date.now() - cmd.startTime) / 1000) * settings.steer.degPerSec, 6);
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
				if (sub.course === cmd.data.course) {
					this.activeCommands.splice(i, 1);
					const threeDigitsCourse = Speech.toThreeDigits(sub.course);
					this.onAddReportAction(
						new Report(this.type, ReportType.REPORT_COURSE, `Conn Helm, current course, ${threeDigitsCourse}`, `${threeDigitsCourse}, aye`),
					);
				} else {
					i++;
				}
			}
		}
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
			return new Command(
				shortText,
				this.type,
				CommandType.RIGHT_RUDDER_SET_COURSE,
				{ course, direction: Direction.RIGHT },
				`Helm, right rudder, steer course ${Speech.toThreeDigits(course)}`,
				`${Direction.RIGHT} rudder steer course ${Speech.toThreeDigits(course)}, aye`,
				true,
				`Conn Helm, steady course ${Speech.toThreeDigits(course)}`,
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
			return new Command(
				shortText,
				this.type,
				CommandType.LEFT_RUDDER_SET_COURSE,
				{ course, direction: Direction.LEFT },
				`Helm, left rudder, steer course ${Speech.toThreeDigits(course)}`,
				`${Direction.LEFT} rudder steer course ${Speech.toThreeDigits(course)}, aye`,
				true,
				`Conn Helm, steady course ${Speech.toThreeDigits(course)}`,
			);
		}
		return null;
	}

	async executeCommand(command: Command) {
		if (command.commandType === CommandType.HELM_REPORT) {
			const course = this.game.getMySub().course;
			const depth = this.game.getMySub().depth;
			await Speech.stationSpeak(`Conn Helm, course ${Speech.toThreeDigits(course)}, depth ${depth} feet`, this.type);
		} else if (command.commandType === CommandType.RIGHT_RUDDER_SET_COURSE || command.commandType === CommandType.LEFT_RUDDER_SET_COURSE) {
			await Speech.stationSpeak(command.responseSpeechText, this.type);
			let i = 0;
			while (i < this.activeCommands.length) {
				const cmd = this.activeCommands[i];
				if (cmd.commandType === CommandType.RIGHT_RUDDER_SET_COURSE || cmd.commandType === CommandType.LEFT_RUDDER_SET_COURSE) {
					this.activeCommands.splice(i, 1);
				} else {
					i++;
				}
			}
			command.startTime = Date.now();
			this.activeCommands.push(command);
		}
	}
}
