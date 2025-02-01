import { getRandomNumber } from '../services/utils';

export class Contact {
	id: number;

	constructor() {
		this.id = getRandomNumber(6);
	}
}
