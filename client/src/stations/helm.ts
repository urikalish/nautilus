import { Speech } from '../services/speech';
import { Game } from '../model/game';
import { Command } from '../model/command';
import { Sub } from '../model/sub';
import { StationType } from '../model/station-type';
import { Station } from '../model/station';

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
		if (shortText.startsWith('HSC')) {
			const m = /^HSC([0-3][0-9][0-9])$/.exec(shortText);
			if (!m) {
				return null;
			}
			const course = parseInt(m[1]);
			if (course >= 360) {
				return null;
			}
			return new Command(this.type, shortText, commandId.SET_COURSE, course, `Helm, set course to ${Speech.toThreeNumbers(course)}`);
		}
		return null;
	}

	async executeCommand(command: Command) {
		if (command.id === commandId.SET_COURSE) {
			await this.speak(`Conn Helm set course to ${Speech.toThreeNumbers(command.data)}, aye`);
			this.game.getMySub().course = command.data;
		}
	}
}
