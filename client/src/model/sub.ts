import { Position } from './position';

export class Sub {
	index: number;
	position: Position;
	course: number; //degrees
	speed: number; //knots
	depth: number; //feet

	constructor(index: number, position: Position, course: number, speed: number, depth: number) {
		this.index = index;
		this.position = position;
		this.course = course;
		this.speed = speed;
		this.depth = depth;
	}
}
