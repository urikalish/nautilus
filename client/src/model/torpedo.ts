import { getRandomNumber } from '../services/utils';

export class Torpedo {
	id: number;

	constructor() {
		this.id = getRandomNumber(6);
	}
}
