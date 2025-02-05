export function calcSector(x: number, y: number): string {
	if (x < 0 || x >= 8 || y < 0 || y >= 8) {
		return '';
	}
	const xSectors = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
	const ySectors = ['1', '2', '3', '4', '5', '6', '7', '8'];
	return xSectors[Math.trunc(x)] + ySectors[Math.trunc(y)];
}

export class Position {
	time: number = Date.now();
	x: number = 0;
	y: number = 0;
	sector: string = '';

	constructor(time: number, x: number, y: number) {
		this.setPosition(time, x, y);
	}

	toString() {
		return `x:${this.x}, y:${this.y}, sector:${this.sector}`;
	}

	setPosition(time: number, x: number, y: number) {
		this.time = time;
		this.x = x;
		this.y = y;
		this.sector = calcSector(x, y);
	}
}
