import { browser } from '$app/environment';
import { DAY_IDS, emptyWeekData, type DayId, type DayEntry, type WeekData } from '$lib/types';

const STORAGE_KEY = 'weeklymoodal:v1';

function load(): WeekData {
	if (!browser) return emptyWeekData();
	try {
		const raw = localStorage.getItem(STORAGE_KEY);
		if (!raw) return emptyWeekData();
		const parsed = JSON.parse(raw) as Partial<WeekData>;
		const fresh = emptyWeekData();
		for (const id of DAY_IDS) {
			fresh.days[id] = { ...fresh.days[id], ...(parsed.days?.[id] ?? {}) };
		}
		fresh.city = parsed.city ?? null;
		return fresh;
	} catch {
		return emptyWeekData();
	}
}

class WeekStore {
	data = $state<WeekData>(load());

	get allDaysSaved(): boolean {
		return DAY_IDS.every((id) => this.data.days[id].savedAt !== null);
	}

	#persist() {
		if (browser) localStorage.setItem(STORAGE_KEY, JSON.stringify(this.data));
	}

	setCity(city: string) {
		this.data.city = city;
		this.#persist();
	}

	saveDay(id: DayId, entry: Omit<DayEntry, 'savedAt'>) {
		this.data.days[id] = { ...entry, savedAt: new Date().toISOString() };
		this.#persist();
	}

	isDaySaved(id: DayId): boolean {
		return this.data.days[id].savedAt !== null;
	}

	reset() {
		if (browser) localStorage.removeItem(STORAGE_KEY);
		this.data = emptyWeekData();
	}
}

export const weekStore = new WeekStore();
