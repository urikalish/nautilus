export class Sound {
	playEnvironmentSounds() {
		const soundSubInternal = document.getElementById('sound-sub-internal') as HTMLAudioElement;
		const soundSonarPing = document.getElementById('sound-sonar-ping') as HTMLAudioElement;
		soundSubInternal.volume = 0.5;
		soundSonarPing.volume = 0.05;
		soundSubInternal.play().then(() => {});
		soundSonarPing.play().then(() => {});
	}

	start() {
		this.playEnvironmentSounds();
	}
}
