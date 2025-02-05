import { getRandomNumber } from '../services/utils';
import { ContactType } from './contact-type';

export class Contact {
	id: number;
	type: ContactType;
	name: string;
	x: number;
	y: number;

	constructor(type: ContactType, name: string) {
		this.id = getRandomNumber(6);
		this.type = type;
		this.name = name;
		this.x = -1;
		this.y = -1;
	}
}
