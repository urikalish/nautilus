import { Speech } from '../services/speech';
import { Game } from '../model/game';

export class Helm {
	game: Game;
	lastReportedCourse: number;
	lastReportedDepth: number;

	constructor(game: Game) {
		this.game = game;
		this.lastReportedCourse = -1;
		this.lastReportedDepth = -1;
	}

	speak(text: string, cb?: () => void) {
		Speech.speak(text, 0, 2.0, 1.5, 1.0, cb);
	}

	reportCourseAndDepth(reportCourse: boolean, reportDepth: boolean) {
		const course = this.game.getMySub().course;
		const depth = this.game.getMySub().depth;
		this.lastReportedCourse = course;
		this.lastReportedDepth = depth;
		console.log(`course:${course}, depth:${depth}`);
		this.speak(`Conn Helm, ${reportCourse ? `course ${Speech.toThreeNumbers(course)}` : ``} ${reportDepth ? `, depth ${depth} feet` : ``}`);
	}

	update() {
		const courseChanged = this.game.getMySub().course !== this.lastReportedCourse;
		const depthChanged = this.game.getMySub().depth !== this.lastReportedDepth;
		if (courseChanged || depthChanged) {
			this.reportCourseAndDepth(courseChanged, depthChanged);
		}
	}
}
