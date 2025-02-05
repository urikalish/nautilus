import { StationType } from '../model/station-type';

function speak(text: string, options: SpeakOptions) {
	return new Promise((resolve: any, reject: any) => {
		const utterance = new SpeechSynthesisUtterance(text);
		utterance.voice = Speech.voices[options.voiceIndex || 0];
		utterance.pitch = options.pitch || 1;
		utterance.rate = options.rate || 1;
		utterance.volume = options.volume || 1;
		utterance.onend = () => {
			Speech.isTalking = false;
			resolve();
		};
		utterance.onerror = error => reject(error);
		Speech.isTalking = true;
		window.speechSynthesis.speak(utterance);
	});
}

export async function stationSpeak(text: string, stationType: StationType) {
	if (stationType === StationType.CONN) {
		await speak(text, { pitch: 1.0, rate: 1.5 });
	} else {
		await speak(text, { pitch: 2.0, rate: 2.0 });
	}
}

export async function connSpeak(text: string) {
	await stationSpeak(text, StationType.CONN);
}

export function toNatoPhonetic(letter: string): string {
	if (!letter) {
		return '';
	}
	const natoPhonetic = {
		A: 'Alfa',
		B: 'Bravo',
		C: 'Charlie',
		D: 'Delta',
		E: 'Echo',
		F: 'Foxtrot',
		G: 'Golf',
		H: 'Hotel',
		I: 'India',
		J: 'Juliett',
		K: 'Kilo',
		L: 'Lima',
		M: 'Mike',
		N: 'November',
		O: 'Oscar',
		P: 'Papa',
		Q: 'Quebec',
		R: 'Romeo',
		S: 'Sierra',
		T: 'Tango',
		U: 'Uniform',
		V: 'Victor',
		W: 'Whiskey',
		X: 'X',
		Y: 'Yankee',
		Z: 'Zulu',
		'0': 'Zero',
		'1': 'One',
		'2': 'Two',
		'3': 'Three',
		'4': 'Four',
		'5': 'Five',
		'6': 'Six',
		'7': 'Seven',
		'8': 'Eight',
		'9': 'Niner',
	};
	return natoPhonetic[letter.toUpperCase()];
}

export function toNatoPhoneticDigits(numStr: string): string {
	let str = '';
	for (let i = 0; i < numStr.length; i++) {
		str += toNatoPhonetic(numStr[i]);
	}
	return str;
}

export class SpeakOptions {
	voiceIndex?: number;
	pitch?: number;
	rate?: number;
	volume?: number;
}

export class Speech {
	static isTalking: boolean = false;
	static synth: SpeechSynthesis;
	static voices: SpeechSynthesisVoice[] = [];

	static init() {
		Speech.synth = window.speechSynthesis;
		window.speechSynthesis.onvoiceschanged = function () {
			Speech.voices = window.speechSynthesis.getVoices();
		};
		window.speechSynthesis.getVoices();
	}
}
