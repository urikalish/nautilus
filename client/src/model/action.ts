export enum ActionType {
	COMMAND = 'command',
	REPORT = 'report,',
}

export interface Action {
	actionType: ActionType;
	id: number;
	creationTime: number;
}
