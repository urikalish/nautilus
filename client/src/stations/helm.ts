import { Speech } from '../services/speech';
import { Game } from '../model/game';
import { Command, CommandType } from '../model/command';
import { Sub } from '../model/sub';
import { StationType } from '../model/station-type';
import { Station } from '../model/station';
import { Direction } from '../model/direction';
import { settings } from '../model/settings';
import { roundDecimal } from '../services/utils';
import { Report } from '../model/report';

export class Helm implements Station {
	type: StationType = StationType.HELM;
	game: Game;
	lastReportedCourse: number = -1;
	lastReportedDepth: number = -1;
	activeCommands: Command[] = [];

	constructor(game: Game) {
		this.game = game;
	}

	async speak(text: string) {
		await Speech.speak(text, { pitch: 2.0, rate: 1.5 });
	}

	async report() {
		const course = this.game.getMySub().course;
		const depth = this.game.getMySub().depth;
		this.lastReportedCourse = course;
		this.lastReportedDepth = depth;
		console.log(`course:${course}, depth:${depth}`);
		await this.speak(`Conn Helm, course ${Speech.toThreeDigits(course)}, depth ${depth} feet`);
	}

	async tick() {
		const sub: Sub = this.game.getMySub();
		let i = 0;
		while (i < this.activeCommands.length) {
			const cmd = this.activeCommands[i];
			const delta = ((Date.now() - cmd.startTime) / 1000) * settings.steer.degPerSec;
			if (cmd.data.direction === Direction.RIGHT) {
				sub.course = Math.min(roundDecimal(sub.course + delta, 3), cmd.data.course);
			} else {
				sub.course = Math.max(roundDecimal(sub.course - delta, 3), cmd.data.course);
			}
			if (sub.course === cmd.data.course) {
				this.activeCommands.splice(i, 1);
			} else {
				i++;
			}
		}
	}

	parseCommand(shortText: string): Command | null {
		if (shortText.startsWith('HRRSC')) {
			const m = /^HRRSC([0-3][0-9][0-9])$/.exec(shortText);
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
				CommandType.SET_COURSE,
				{ course, direction: Direction.RIGHT },
				`Helm, right rudder, steer course ${Speech.toThreeDigits(course)}`,
				`${Direction.RIGHT} rudder steer course ${Speech.toThreeDigits(course)}, aye`,
				true,
				`Conn Helm, steady course ${Speech.toThreeDigits(course)}`,
			);
		} else if (shortText.startsWith('HLRSC')) {
			const m = /^HLRSC([0-3][0-9][0-9])$/.exec(shortText);
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
				CommandType.SET_COURSE,
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
		await Speech.stationSpeak(command.responseSpeechText, this.type);
		if (command.needsTimeToComplete) {
			command.startTime = Date.now();
			this.activeCommands.push(command);
		}
	}
}
