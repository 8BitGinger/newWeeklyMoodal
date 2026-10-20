import { base } from '$app/paths';

let clickAudio: HTMLAudioElement | null = null;
let closeAudio: HTMLAudioElement | null = null;

export function playClickSound() {
	clickAudio ??= new Audio(`${base}/audio/click2.wav`);
	clickAudio.currentTime = 0;
	void clickAudio.play().catch(() => {});
}

export function playCloseSound() {
	closeAudio ??= new Audio(`${base}/audio/click.wav`);
	closeAudio.currentTime = 0;
	void closeAudio.play().catch(() => {});
}

/** Tiny synthesized four-note chime for the weekly wrap celebration (no audio asset needed). */
export function playTadaSound() {
	try {
		const ctx = new AudioContext();
		const now = ctx.currentTime;
		const notes = [523.25, 659.25, 783.99, 1046.5]; // C5 E5 G5 C6
		notes.forEach((freq, i) => {
			const osc = ctx.createOscillator();
			const gain = ctx.createGain();
			osc.type = 'triangle';
			osc.frequency.value = freq;
			const start = now + i * 0.09;
			gain.gain.setValueAtTime(0, start);
			gain.gain.linearRampToValueAtTime(0.2, start + 0.02);
			gain.gain.exponentialRampToValueAtTime(0.001, start + 0.35);
			osc.connect(gain).connect(ctx.destination);
			osc.start(start);
			osc.stop(start + 0.4);
		});
		setTimeout(() => void ctx.close(), notes.length * 90 + 500);
	} catch {
		// audio is a nice-to-have, never block the celebration on it
	}
}
