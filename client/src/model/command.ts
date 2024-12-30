import { StationType } from './station-type';

export class Command {
	time: number;
	stationType: StationType;
	shortText: string;
	id: string;
	data: any;
	speechText: string;

	constructor(stationType: StationType, shortText: string, id: string, data: any, speechText: string) {
		this.time = Date.now();
		this.shortText = shortText;
		this.stationType = stationType;
		this.id = id;
		this.data = data;
		this.speechText = speechText;
	}
}
