export class SpeakOptions {
	voiceIndex?: number;
	pitch?: number;
	rate?: number;
	volume?: number;
}

export class Speech {
	static synth: SpeechSynthesis;
	static voices: SpeechSynthesisVoice[] = [];

	static init() {
		Speech.synth = window.speechSynthesis;
		window.speechSynthesis.onvoiceschanged = function () {
			Speech.voices = window.speechSynthesis.getVoices();
		};
		window.speechSynthesis.getVoices();
	}

	static speak(text, options: SpeakOptions) {
		return new Promise((resolve: any, reject: any) => {
			const utterance = new SpeechSynthesisUtterance(text);
			utterance.voice = Speech.voices[options.voiceIndex || 0];
			utterance.pitch = options.pitch || 1;
			utterance.rate = options.rate || 1;
			utterance.volume = options.volume || 1;
			utterance.onend = () => resolve();
			utterance.onerror = error => reject(error);
			window.speechSynthesis.speak(utterance);
		});
	}

	static toNatoPhonetic(letter: string): string {
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

	static toThreeNumbers(num: number): string {
		let numStr = num.toString();
		if (numStr.length === 1) {
			numStr = '00' + numStr;
		} else if (numStr.length === 2) {
			numStr = '0' + numStr;
		}
		return `${Speech.toNatoPhonetic(numStr[0])} ${Speech.toNatoPhonetic(numStr[1])} ${Speech.toNatoPhonetic(numStr[2])}`;
	}
}
