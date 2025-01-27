import { StationType } from './station-type';
import { Command } from './command';
import { Report } from './report';

export interface Station {
	type: StationType;
	tick(): Promise<void>;
	parseCommand: (shortText: string) => Command | null;
	executeCommand(command: Command): Promise<void>;
}
