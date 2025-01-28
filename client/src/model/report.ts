import { StationType } from './station-type';
import { getRandomNumber } from '../services/utils';
import { Action, ActionType } from './action';

export enum ReportType {
	REPORT_SECTOR = 'report-sector',
	REPORT_COURSE = 'report-course',
}

export class Report implements Action {
	actionType: ActionType;
	id: number;
	creationTime: number;
	stationType: StationType;
	reportType: string;
	reportSpeechText: string;
	responseSpeechText: string;

	constructor(stationType: StationType, reportType: string, reportSpeechText: string, responseSpeechText: string) {
		this.actionType = ActionType.REPORT;
		this.id = getRandomNumber(6);
		this.creationTime = Date.now();
		this.stationType = stationType;
		this.reportType = reportType;
		this.reportSpeechText = reportSpeechText;
		this.responseSpeechText = responseSpeechText;
	}
}
