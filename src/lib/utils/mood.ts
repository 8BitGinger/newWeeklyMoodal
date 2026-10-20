import { base } from '$app/paths';
import type { Mood } from '$lib/types';

const MOOD_IMAGES: Record<Mood, string> = {
	happy: `${base}/images/happy-png.png`,
	neutral: `${base}/images/neutral-png.png`,
	sad: `${base}/images/sad-png.png`,
	angry: `${base}/images/stressed-png.png`
};

export function moodImage(mood: Mood | null): string | null {
	return mood ? MOOD_IMAGES[mood] : null;
}

/** CSS color value for a mood's accent token (see --color-* in layout.css), for live mood tinting. */
export function moodColor(mood: Mood | null): string | null {
	return mood ? `var(--color-${mood})` : null;
}

export const MOOD_OPTIONS: { value: Mood; icon: string; label: string }[] = [
	{ value: 'happy', icon: 'fa-face-smile', label: 'Happy' },
	{ value: 'neutral', icon: 'fa-face-meh', label: 'Neutral' },
	{ value: 'sad', icon: 'fa-face-sad-tear', label: 'Sad' },
	{ value: 'angry', icon: 'fa-face-angry', label: 'Angry' }
];
