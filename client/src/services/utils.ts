export function getRandomNumber(numOfDigits: number) {
	const min = Math.pow(10, numOfDigits - 1);
	const max = Math.pow(10, numOfDigits) - 1;
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function getDateTime(date: Date) {
	const year = date.getFullYear().toString().slice(2); // Get last two digits of the year
	const month = ('0' + (date.getMonth() + 1)).slice(-2); // Format month as two digits
	const day = ('0' + date.getDate()).slice(-2); // Format day as two digits
	const hours = ('0' + date.getHours()).slice(-2); // Format hours as two digits
	const minutes = ('0' + date.getMinutes()).slice(-2); // Format minutes as two digits
	const seconds = ('0' + date.getSeconds()).slice(-2); // Format seconds as two digits
	return `${day}/${month}/${year}/ ${hours}:${minutes}:${seconds}`;
}

export function roundDecimal(number: number, decimalPlaces: number): number {
	return Math.round(number * 10 ** decimalPlaces) / 10 ** decimalPlaces;
}

export function toTwoDigits(num: number): string {
	let numStr = num.toString();
	if (numStr.length === 1) {
		numStr = '0' + numStr;
	}
	return numStr;
}

export function toThreeDigits(num: number): string {
	let numStr = num.toString();
	if (numStr.length === 1) {
		numStr = '00' + numStr;
	} else if (numStr.length === 2) {
		numStr = '0' + numStr;
	}
	return numStr;
}

export function toFourDigits(num: number): string {
	let numStr = num.toString();
	if (numStr.length === 1) {
		numStr = '000' + numStr;
	} else if (numStr.length === 2) {
		numStr = '00' + numStr;
	} else if (numStr.length === 3) {
		numStr = '0' + numStr;
	}
	return numStr;
}

export function calcDistance(x1: number, y1: number, x2: number, y2: number): number {
	return Math.sqrt((x1 - x2) ** 2 + (y1 - y2) ** 2);
}

export function calcAngle(x1: number, y1: number, x2: number, y2: number): number {
	return ((Math.atan2(x2 - x1, y2 - y1) * 180) / Math.PI + 360) % 360;
}

export function calcBearing(x1: number, y1: number, x2: number, y2: number, ownCourse: number): number {
	return (calcAngle(x1, y1, x2, y2) - ownCourse + 360) % 360;
}
