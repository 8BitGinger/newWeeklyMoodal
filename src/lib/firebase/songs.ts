import { getStorage, ref, listAll, getDownloadURL } from 'firebase/storage';
import type { Mood } from '$lib/types';
import { firebaseApp } from './app';
import { firebaseConfigured } from './config';

export interface MoodSongResult {
	songUrl: string;
	title: string;
	artist: string | null;
	thumbnailUrl: string | null;
}

// Dedicated folders in the shared ryfimusic-b6ccf bucket - separate from ryfimusic.com's
// own catalog. Drop audio files in here (any filename) to make them eligible to be picked.
const FOLDERS: Record<Mood | 'recap', string> = {
	happy: 'weeklyMoodal/happy',
	neutral: 'weeklyMoodal/neutral',
	sad: 'weeklyMoodal/sad',
	angry: 'weeklyMoodal/angry',
	recap: 'weeklyMoodal/recap'
};

/** "Artist - Title.mp3" -> {artist, title}; any other filename becomes the title with no artist. */
function parseFilename(name: string): { title: string; artist: string | null } {
	const base = name.replace(/\.[^./]+$/, '');
	const [first, ...rest] = base.split(' - ');
	if (rest.length > 0) return { artist: first.trim(), title: rest.join(' - ').trim() };
	return { artist: null, title: base.trim() };
}

export async function fetchMoodSong(mood: Mood | 'recap'): Promise<MoodSongResult | null> {
	if (!firebaseConfigured) return null;

	try {
		const storage = getStorage(firebaseApp);
		const { items } = await listAll(ref(storage, FOLDERS[mood]));
		if (items.length === 0) return null;

		const pick = items[Math.floor(Math.random() * items.length)];
		const songUrl = await getDownloadURL(pick);
		const { title, artist } = parseFilename(pick.name);

		return { songUrl, title, artist, thumbnailUrl: null };
	} catch (err) {
		console.error(`fetchMoodSong("${mood}") failed`, err);
		return null;
	}
}
