import { StationType } from './station-type';
import { getRandomNumber } from '../services/utils';
import { Action, ActionType } from './action';

export const CommandShortText = {
	NAVIGATION_REPORT: 'NR',
	HELM_REPORT: 'HR',
	ENGINEERING_REPORT: 'ER',
	HELM_RIGHT_RUDDER_SET_COURSE: 'HRRSC',
	HELM_LEFT_RUDDER_SET_COURSE: 'HLRSC',
};

export enum CommandType {
	ALL_STATIONS_REPORT = 'all-stations-report',
	NAVIGATION_REPORT = 'navigation-report',
	HELM_REPORT = 'helm-report',
	ENGINEERING_REPORT = 'engineering-report',
	RIGHT_RUDDER_SET_COURSE = 'right-rudder-set-course',
	LEFT_RUDDER_SET_COURSE = 'left-rudder-set-course',
}

export class Command implements Action {
	actionType: ActionType;
	id: number;
	creationTime: number;
	shortText: string;
	stationType: StationType;
	commandType: string;
	data: any;
	commandSpeechText: string;
	responseSpeechText: string;
	needsTimeToComplete: boolean;
	startTime: number;
	completionSpeechText: string;

	constructor(
		shortText: string,
		stationType: StationType,
		commandType: string,
		data: any = null,
		commandSpeechText: string = '',
		responseSpeechText: string = '',
		needsTimeToComplete: boolean = false,
		completionSpeechText: string = '',
	) {
		this.actionType = ActionType.COMMAND;
		this.id = getRandomNumber(6);
		this.creationTime = Date.now();
		this.shortText = shortText;
		this.stationType = stationType;
		this.commandType = commandType;
		this.data = data;
		this.commandSpeechText = commandSpeechText;
		this.responseSpeechText = responseSpeechText;
		this.needsTimeToComplete = needsTimeToComplete;
		this.startTime = Date.now();
		this.completionSpeechText = completionSpeechText;
	}
}
