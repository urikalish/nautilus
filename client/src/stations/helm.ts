import { Speech } from '../services/speech';
import { Game } from '../model/game';
import { Command, CommandType } from '../model/command';
import { Station } from '../model/station';

export class Helm {
	station: Station = Station.HELM;
	game: Game;
	lastReportedCourse: number = -1;
	lastReportedDepth: number = -1;

	constructor(game: Game) {
		this.game = game;
	}

	speak(text: string, cb?: () => void) {
		Speech.speak(text, 0, 2.0, 1.5, 1.0, cb);
	}

	report(reportCourse: boolean = true, reportDepth: boolean = true) {
		const course = this.game.getMySub().course;
		const depth = this.game.getMySub().depth;
		this.lastReportedCourse = course;
		this.lastReportedDepth = depth;
		console.log(`course:${course}, depth:${depth}`);
		this.speak(`Conn Helm ${reportCourse ? `, course ${Speech.toThreeNumbers(course)}` : ``} ${reportDepth ? `, depth ${depth} feet` : ``}`);
	}

	update() {
		const courseChanged = this.game.getMySub().course !== this.lastReportedCourse;
		const depthChanged = this.game.getMySub().depth !== this.lastReportedDepth;
		if (courseChanged || depthChanged) {
			this.report(courseChanged, depthChanged);
		}
	}

	setCourse(course: number) {
		this.game.getMySub().course = course;
	}

	getCommandText(command: Command) {
		if (command.type === CommandType.SET_COURSE) {
			return `Helm, set course to ${Speech.toThreeNumbers(command.data)}`;
		}
		alert(`Unknown ${this.station} command ${command.type}`);
	}

	handleCommand(command: Command) {
		if (command.type === CommandType.SET_COURSE) {
			this.speak(`Conn Helm, set course to ${Speech.toThreeNumbers(command.data)}, aye`, () => {
				this.setCourse(command.data);
			});
		}
	}
}
