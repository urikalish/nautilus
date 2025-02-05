import { Command, CommandType } from '../model/command';

export function removeActiveCommands(activeCommands: Command[], commandTypes: CommandType[]) {
	commandTypes.forEach(ct => {
		let i = 0;
		while (i < activeCommands.length) {
			const cmd = activeCommands[i];
			if (cmd.commandType === ct) {
				activeCommands.splice(i, 1);
			} else {
				i++;
			}
		}
	});
}
