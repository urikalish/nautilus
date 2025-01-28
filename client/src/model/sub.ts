import { Position } from './position';

export class Sub {
	index: number;
	position: Position;
	course: number; //degrees
	rotation: number; //degrees
	speed: number; //knots
	depth: number; //feet

	constructor(index: number, position: Position, course: number, speed: number, depth: number) {
		this.index = index;
		this.position = position;
		this.course = course;
		this.rotation = course <= 180 ? course : course - 360;
		this.speed = speed;
		this.depth = depth;
	}
}
