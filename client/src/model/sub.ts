import { Position } from './position';
import { getRandomNumber } from '../services/utils';
import { Contact } from './contact';
import { settings } from './settings';

export class Sub {
	id: number;
	index: number;
	position: Position;
	course: number; //degrees
	rotation: number; //degrees
	speed: number; //knots
	depth: number; //feet
	contacts: Contact[];
	waterfall: any[];

	constructor(index: number, position: Position, course: number, speed: number, depth: number) {
		this.id = getRandomNumber(6);
		this.index = index;
		this.position = position;
		this.course = course;
		this.rotation = course <= 180 ? course : course - 360;
		this.speed = speed;
		this.depth = depth;
		this.contacts = [];
		this.waterfall = [];
		for (let r = 0; r < settings.sonar.waterfallRows; r++) {
			const row: number[] = [];
			for (let c = 0; c < 360; c++) {
				row[c] = Math.random() * settings.sonar.waterfallNoiseMax;
			}
			this.waterfall.push(row);
		}
	}
}
