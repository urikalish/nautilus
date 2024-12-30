import { StationType } from './station-type';

export class Command {
	time: number;
	text: string;
	stationType: StationType;
	id: string;
	data: any;

	constructor(text: string, stationType: StationType, id: string, data: any) {
		this.time = Date.now();
		this.text = text;
		this.stationType = stationType;
		this.id = id;
		this.data = data;
	}
}
