import { StationType } from '../model/station-type';
import { Command } from '../model/command';

export interface Station {
	type: StationType;
	speak(text: string): Promise<void>;
	report(flags?: boolean[]): Promise<void>;
	tick(): Promise<void>;
	parseCommand: (shortText: string) => Command | null;
	executeCommand(command: Command): Promise<void>;
}
