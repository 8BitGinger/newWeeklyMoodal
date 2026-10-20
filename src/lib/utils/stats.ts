import { DAY_IDS, type Mood, type WeekData } from '$lib/types';
import { mostCommon, weatherCodeToImage } from './weather';

export interface WeeklyStats {
	totalWater: number;
	avgStress: number;
	avgEnergy: number;
	avgSleep: number;
	sleepMessage: string;
	mostCommonMood: Mood | null;
	weatherImage: string;
}

export function computeWeeklyStats(data: WeekData): WeeklyStats {
	const days = DAY_IDS.map((id) => data.days[id]);

	const totalWater = days.reduce((sum, d) => sum + (d.water ?? 0), 0);
	const avgStress = average(days.map((d) => d.stress));
	const avgEnergy = average(days.map((d) => d.energy));
	const avgSleep = average(days.map((d) => d.sleep ?? 0));

	let sleepMessage: string;
	if (avgSleep < 6) {
		sleepMessage = 'You should sleep more!';
	} else if (avgSleep <= 8) {
		sleepMessage = 'Great job! You have an excellent sleep pattern!';
	} else {
		sleepMessage = 'You might be sleeping a bit too much!';
	}

	const mostCommonMood = mostCommon(
		days.map((d) => d.mood).filter((m): m is Mood => m !== null)
	);
	const weatherImage = weatherCodeToImage(
		mostCommon(days.map((d) => d.weatherCode).filter((c): c is number => c !== null))
	);

	return {
		totalWater,
		avgStress: Math.round(avgStress),
		avgEnergy: Math.round(avgEnergy),
		avgSleep: Math.round(avgSleep * 100) / 100,
		sleepMessage,
		mostCommonMood,
		weatherImage
	};
}

function average(values: number[]): number {
	if (values.length === 0) return 0;
	return values.reduce((sum, v) => sum + v, 0) / values.length;
}
