export const DAY_IDS = [
	'sunday',
	'monday',
	'tuesday',
	'wednesday',
	'thursday',
	'friday',
	'saturday'
] as const;

export type DayId = (typeof DAY_IDS)[number];

export type Mood = 'happy' | 'neutral' | 'sad' | 'angry';

export interface DayEntry {
	water: number | null;
	stress: number;
	mood: Mood | null;
	energy: number;
	sleep: number | null;
	songUrl: string | null;
	songTitle: string | null;
	songArtist: string | null;
	thumbnailUrl: string | null;
	weatherCode: number | null;
	weatherTemp: number | null;
	savedAt: string | null;
}

export interface WeekData {
	city: string | null;
	days: Record<DayId, DayEntry>;
}

export function emptyDayEntry(): DayEntry {
	return {
		water: null,
		stress: 50,
		mood: null,
		energy: 50,
		sleep: null,
		songUrl: null,
		songTitle: null,
		songArtist: null,
		thumbnailUrl: null,
		weatherCode: null,
		weatherTemp: null,
		savedAt: null
	};
}

export function emptyWeekData(): WeekData {
	const days = {} as Record<DayId, DayEntry>;
	for (const id of DAY_IDS) days[id] = emptyDayEntry();
	return { city: null, days };
}
