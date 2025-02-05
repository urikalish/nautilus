import { Command, CommandType } from '../model/command';

export function addActiveCommand(newCommand: Command, activeCommands: Command[], removeCommandTypes: CommandType[]) {
	removeCommandTypes.forEach(removeType => {
		let i = 0;
		while (i < activeCommands.length) {
			const cmd = activeCommands[i];
			if (cmd.commandType === removeType) {
				activeCommands.splice(i, 1);
			} else {
				i++;
			}
		}
	});
	newCommand.lastTickTime = Date.now();
	activeCommands.push(newCommand);
}
