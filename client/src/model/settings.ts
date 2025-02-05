export const settings = {
	debug: true,
	appName: 'Kalish Nautilus',
	submarineClass: 'Virginia',
	speed: {
		full: 30, //knots
		twoThirds: 20, //knots
		oneThird: 10, //knots
	},
	depth: {
		test: 800, //feet
		max: 1600, //feet
		feetPerSec: 3,
	},
	steer: {
		degPerSec: 3,
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
		waterfallNoiseMax: 0.1,
	},
};
