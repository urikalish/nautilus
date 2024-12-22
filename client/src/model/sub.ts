import { Position } from './position';

export class Sub {
	index: number;
	position: Position;
	courseDeg: number;
	speedKnots: number;
	depthFeet: number;

	constructor(index: number, position: Position, courseDeg: number, speedKnots: number, depthFeet: number) {
		this.index = index;
		this.position = position;
		this.courseDeg = courseDeg;
		this.speedKnots = speedKnots;
		this.depthFeet = depthFeet;
	}
}
