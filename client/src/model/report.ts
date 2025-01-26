import { StationType } from './station-type';
import { getRandomNumber } from '../services/utils';
import { Action, ActionType } from './action';

export enum ReportType {
	REPORT = 'report',
}

export class Report implements Action {
	actionType: ActionType;
	id: number;
	creationTime: number;
	stationType: StationType;
	reportType: string;
	reportSpeechText: string;
	responseSpeechText: string;

	constructor(shortText: string, stationType: StationType, reportType: string, reportSpeechText: string, responseSpeechText: string) {
		this.actionType = ActionType.REPORT;
		this.id = getRandomNumber(6);
		this.creationTime = Date.now();
		this.stationType = stationType;
		this.reportType = reportType;
		this.reportSpeechText = reportSpeechText;
		this.responseSpeechText = responseSpeechText;
	}
}
