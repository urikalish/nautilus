export class Position {
	time: number;
	x: number;
	y: number;
	sector: string;

	constructor(x: number, y: number) {
		this.time = Date.now();
		this.x = x;
		this.y = y;
		this.sector = Position.calcSector(this.x, this.y);
	}

	static calcSector(x: number, y: number): string {
		if (x < 0 || x >= 8 || y < 0 || y >= 8) {
			return '';
		}
		const xSectors = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
		const ySectors = ['1', '2', '3', '4', '5', '6', '7', '8'];
		return xSectors[Math.trunc(x)] + ySectors[Math.trunc(y)];
	}

	updatePosition(curSpeedKnots: number, curAngle: number) {
		const newTime = Date.now();
		const deltaTimeMs = newTime - this.time;
		const deltaDistanceMiles = (curSpeedKnots / 3600000) * deltaTimeMs;
		const angleInRadians = ((curAngle - 90) * Math.PI) / 180;
		this.time = newTime;
		this.x = Number((this.x += deltaDistanceMiles * Math.cos(angleInRadians)).toFixed(3));
		this.y = Number((this.y -= deltaDistanceMiles * Math.sin(angleInRadians)).toFixed(3));
		this.sector = Position.calcSector(this.x, this.y);
	}
}
