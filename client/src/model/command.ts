import { StationType } from './station-type';
import { getRandomNumber } from '../services/utils';

export class Command {
	id: number;
	time: number;
	shortText: string;
	stationType: StationType;
	commandType: string;
	data: any;
	commandSpeechText: string;
	responseSpeechText: string;
	needsTimeToComplete: boolean;
	completionSpeechText: string;

	constructor(
		shortText: string,
		stationType: StationType,
		commandType: string,
		data: any,
		commandSpeechText: string,
		responseSpeechText: string,
		needsTimeToComplete: boolean,
		completionSpeechText: string,
	) {
		this.id = getRandomNumber(6);
		this.time = Date.now();
		this.shortText = shortText;
		this.stationType = stationType;
		this.commandType = commandType;
		this.data = data;
		this.commandSpeechText = commandSpeechText;
		this.responseSpeechText = responseSpeechText;
		this.needsTimeToComplete = needsTimeToComplete;
		this.completionSpeechText = completionSpeechText;
	}
}
