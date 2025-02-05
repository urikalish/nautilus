import { Position } from './position';
import { getRandomNumber } from '../services/utils';
import { Contact } from './contact';

export class Sub {
	id: number;
	index: number;
	position: Position;
	course: number; //degrees
	rotation: number; //degrees
	speed: number; //knots
	depth: number; //feet
	contacts: Contact[];

	constructor(index: number, position: Position, course: number, speed: number, depth: number) {
		this.id = getRandomNumber(6);
		this.index = index;
		this.position = position;
		this.course = course;
		this.rotation = course <= 180 ? course : course - 360;
		this.speed = speed;
		this.depth = depth;
		this.contacts = [];
	}
}
