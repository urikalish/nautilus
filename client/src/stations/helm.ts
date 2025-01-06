import { Speech } from '../services/speech';
import { Game } from '../model/game';
import { Command } from '../model/command';
import { Sub } from '../model/sub';
import { StationType } from '../model/station-type';
import { Station } from '../model/station';
import { Direction } from '../model/direction';

enum commandId {
	SET_COURSE = 'set-course',
}

export class Helm implements Station {
	type: StationType = StationType.HELM;
	game: Game;
	lastReportedCourse: number = -1;
	lastReportedDepth: number = -1;

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
		await this.speak(`Conn Helm, course ${Speech.toThreeNumbers(course)}, depth ${depth} feet`);
	}

	async tick() {
		const sub: Sub = this.game.getMySub();
		const courseChanged = sub.course !== this.lastReportedCourse;
		const depthChanged = sub.depth !== this.lastReportedDepth;
		if (courseChanged || depthChanged) {
			await this.report();
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
				this.type,
				shortText,
				commandId.SET_COURSE,
				{ course, direction: Direction.RIGHT },
				`Helm, right rudder, steer course ${Speech.toThreeNumbers(course)}`,
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
				this.type,
				shortText,
				commandId.SET_COURSE,
				{ course, direction: Direction.LEFT },
				`Helm, left rudder, steer course ${Speech.toThreeNumbers(course)}`,
			);
		}
		return null;
	}

	async executeCommand(command: Command) {
		if (command.id === commandId.SET_COURSE) {
			await this.speak(`${command.data.direction} rudder, steer course ${Speech.toThreeNumbers(command.data.course)}, Conn Helm, aye`);
			this.game.getMySub().course = command.data.course;
		}
	}
}
