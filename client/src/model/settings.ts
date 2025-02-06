export const settings = {
	debug: true,
	appName: 'Kalish Nautilus',
	submarineClass: 'Virginia',
	speed: {
		third: 10, //knots
		twoThirds: 20, //knots
		standard: 25, //knots
		full: 30, //knots
		flank: 40, //knots
		changePerSec: 1, //knots
	},
	depth: {
		max: 1600, //feet
		changePerSec: 6,
	},
	steer: {
		changePerSec: 3,
	},
	tube: {
		count: 4,
	},
	torpedo: {
		count: 25,
		type: 'Mark 48',
		speed: 55, //knots
	},
	sonar: {
		waterfallRows: 180,
		waterfallNoiseMax: 0.2,
		waterfallSection: 0.25,
	},
};
