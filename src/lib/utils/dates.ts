import dayjs, { type Dayjs } from 'dayjs';
import { DAY_IDS, type DayId } from '$lib/types';

export interface DayDate {
	id: DayId;
	label: string;
	date: Dayjs;
}

const LABELS: Record<DayId, string> = {
	sunday: 'Sunday',
	monday: 'Monday',
	tuesday: 'Tuesday',
	wednesday: 'Wednesday',
	thursday: 'Thursday',
	friday: 'Friday',
	saturday: 'Saturday'
};

/** Returns the Sun-Sat week containing `today`, one entry per day. */
export function getWeekDates(today: Dayjs = dayjs()): DayDate[] {
	const todayDow = today.day();
	return DAY_IDS.map((id, index) => ({
		id,
		label: LABELS[id],
		date: today.add(index - todayDow, 'day')
	}));
}
