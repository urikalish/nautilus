import { StationType } from '../model/station-type';
import { Command } from '../model/command';

export interface Station {
	type: StationType;
	commands: Command[];
	speak: (text: string, cb?: () => void) => void;
	report: (flags?: boolean[], cb?: () => void) => void;
	tick: () => void;
}
