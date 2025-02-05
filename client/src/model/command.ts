import { StationType } from './station-type';
import { getRandomNumber } from '../services/utils';
import { Action, ActionType } from './action';

export const CommandShortText = {
	ALL_STATIONS_REPORT: 'ASR',
	NAVIGATION_REPORT: 'NR',
	HELM_REPORT: 'HR',
	MANEUVERING_REPORT: 'MR',
	SONAR_REPORT: 'SR',
	HELM_RIGHT_RUDDER_SET_COURSE: 'HRRSC',
	HELM_LEFT_RUDDER_SET_COURSE: 'HLRSC',
	HELM_MAKE_MY_DEPTH: 'HMMD',
	MANEUVERING_FULL_STOP: 'MFS',
	MANEUVERING_ALL_AHEAD_ONE_THIRD: 'MAA13',
	MANEUVERING_ALL_AHEAD_TWO_THIRDS: 'MAA23',
	MANEUVERING_ALL_AHEAD_STANDARD: 'MAAS',
	MANEUVERING_ALL_AHEAD_FULL: 'MAAF',
	MANEUVERING_ALL_AHEAD_FLANK_CAVITATE: 'MAAFC',
};

export enum CommandType {
	ALL_STATIONS_REPORT = 'all-stations-report',
	NAVIGATION_REPORT = 'navigation-report',
	HELM_REPORT = 'helm-report',
	MANEUVERING_REPORT = 'maneuvering-report',
	SONAR_REPORT = 'sonar-report',
	HELM_RIGHT_RUDDER_SET_COURSE = 'helm-right-rudder-set-course',
	HELM_LEFT_RUDDER_SET_COURSE = 'helm-left-rudder-set-course',
	HELM_MAKE_MY_DEPTH = 'helm-make-my-depth',
	MANEUVERING_FULL_STOP = 'maneuvering-full-stop',
	MANEUVERING_ALL_AHEAD_ONE_THIRD = 'maneuvering-all-ahead-one-third',
	MANEUVERING_ALL_AHEAD_TWO_THIRDS = 'maneuvering-all-ahead-two-thirds',
	MANEUVERING_ALL_AHEAD_STANDARD = 'maneuvering-all-ahead-standard',
	MANEUVERING_ALL_AHEAD_FULL = 'maneuvering-all-ahead-full',
	MANEUVERING_ALL_AHEAD_FLANK_CAVITATE = 'maneuvering-all-ahead-flank-cavitate',
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
	lastTickTime: number;

	constructor(
		shortText: string,
		stationType: StationType,
		commandType: string,
		data: any = null,
		commandSpeechText: string = '',
		responseSpeechText: string = '',
		needsTimeToComplete: boolean = false,
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
		this.lastTickTime = Date.now();
	}
}
