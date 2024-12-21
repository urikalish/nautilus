import { settings } from './settings';

export class Sub {
	index: number;
	class: string;
	speedFull: number;
	depthTestFeet: number;
	depthMaxFeet: number;

	constructor(index: number) {
		this.index = index;
		this.class = settings.subClass;
		this.speedFull = settings.subSpeedFull;
		this.depthTestFeet = settings.subDepthTestFeet;
		this.depthMaxFeet = settings.subDepthMaxFeet;
	}
}
