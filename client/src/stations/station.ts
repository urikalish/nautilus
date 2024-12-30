import { StationType } from '../model/station-type';
import { Command } from '../model/command';

export interface Station {
	type: StationType;
	speak: (text: string) => void;
	report: (flags?: boolean[]) => void;
	tick: () => void;
	parseCommand: (shortText: string) => Command | null;
	executeCommand: (command: Command) => void;
}
