import { StationType } from '../model/station-type';
import { Command } from '../model/command';

export interface Station {
	type: StationType;
	speak: (text: string, cb?: () => void) => void;
	report: (flags?: boolean[], cb?: () => void) => void;
	tick: () => void;
	parseCommand: (shortText: string) => Command | null;
	executeCommand: (command: Command, cb?: () => void) => void;
}
