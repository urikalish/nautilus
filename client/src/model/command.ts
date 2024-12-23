import { Station } from './station';

export enum CommandType {
	NA = '',
	SET_COURSE = 'set-course',
}

export class Command {
	time: number;
	station: Station;
	type: CommandType;
	data: any;

	constructor(station: Station, type: CommandType, data: any) {
		this.time = Date.now();
		this.station = station;
		this.type = type;
		this.data = data;
	}
}
